#![no_std]
//! RemitLastMile: hash-locked cash-out requests redeemable by registered
//! agents. Early skeleton — see docs/ARCHITECTURE.md for known gaps
//! before using this with real funds.

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, Bytes, BytesN, Env, Symbol,
};

#[contracttype]
#[derive(Clone)]
pub struct Agent {
    pub name: Symbol,
    pub location: Symbol,
    pub active: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct CashoutRequest {
    pub sender: Address,
    pub token: Address,
    pub amount: i128,
    pub secret_hash: BytesN<32>,
    pub claimed: bool,
    pub claimed_by: Option<Address>,
    pub created_at: u64,
}

#[contracttype]
pub enum DataKey {
    Agent(Address),
    Request(u32),
    NextRequestId,
}

#[contracterror]
#[derive(Copy, Clone, Debug, PartialEq)]
pub enum Error {
    RequestNotFound = 1,
    AlreadyClaimed = 2,
    InvalidSecret = 3,
    AgentNotRegistered = 4,
}

#[contract]
pub struct RemitLastMileContract;

#[contractimpl]
impl RemitLastMileContract {
    /// Register as a cash-out agent.
    ///
    /// KNOWN GAP: open registration, no bonding or verification.
    /// See docs/adr/001-agent-trust-and-bonding.md — this is the
    /// top-priority issue before any real-money use.
    pub fn register_agent(env: Env, agent: Address, name: Symbol, location: Symbol) {
        agent.require_auth();

        let record = Agent { name, location, active: true };
        env.storage().instance().set(&DataKey::Agent(agent), &record);
    }

    pub fn is_agent_registered(env: Env, agent: Address) -> bool {
        env.storage()
            .instance()
            .get::<_, Agent>(&DataKey::Agent(agent))
            .map(|a| a.active)
            .unwrap_or(false)
    }

    /// Sender deposits funds into escrow behind a hashed secret code.
    /// The plaintext secret must be shared with the intended recipient
    /// out-of-band (SMS, WhatsApp, in person) — it never touches the
    /// chain until claim time.
    pub fn create_cashout_request(
        env: Env,
        sender: Address,
        token: Address,
        amount: i128,
        secret_hash: BytesN<32>,
    ) -> u32 {
        sender.require_auth();

        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&sender, &env.current_contract_address(), &amount);

        let request_id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::NextRequestId)
            .unwrap_or(0);

        let request = CashoutRequest {
            sender,
            token,
            amount,
            secret_hash,
            claimed: false,
            claimed_by: None,
            created_at: env.ledger().timestamp(),
        };

        env.storage().instance().set(&DataKey::Request(request_id), &request);
        env.storage()
            .instance()
            .set(&DataKey::NextRequestId, &(request_id + 1));

        request_id
    }

    /// A registered agent, having been told the plaintext secret by the
    /// recipient (after fronting them cash), claims the escrowed funds.
    pub fn claim_cashout(
        env: Env,
        agent: Address,
        request_id: u32,
        secret: Bytes,
    ) -> Result<(), Error> {
        agent.require_auth();

        if !Self::is_agent_registered(env.clone(), agent.clone()) {
            return Err(Error::AgentNotRegistered);
        }

        let mut request: CashoutRequest = env
            .storage()
            .instance()
            .get(&DataKey::Request(request_id))
            .ok_or(Error::RequestNotFound)?;

        if request.claimed {
            return Err(Error::AlreadyClaimed);
        }

        let computed_hash = env.crypto().sha256(&secret);
        if computed_hash.to_bytes() != request.secret_hash {
            return Err(Error::InvalidSecret);
        }

        let token_client = token::Client::new(&env, &request.token);
        token_client.transfer(&env.current_contract_address(), &agent, &request.amount);

        request.claimed = true;
        request.claimed_by = Some(agent);
        env.storage().instance().set(&DataKey::Request(request_id), &request);

        Ok(())
    }

    pub fn get_request(env: Env, request_id: u32) -> Result<CashoutRequest, Error> {
        env.storage()
            .instance()
            .get(&DataKey::Request(request_id))
            .ok_or(Error::RequestNotFound)
    }
}

mod test;
