#![cfg(test)]

use super::*;
use soroban_sdk::{bytes, symbol_short, testutils::Address as _, Env};

#[test]
fn test_full_cashout_lifecycle() {
    let env = Env::default();
    env.mock_all_auths();

    let sender = Address::generate(&env);
    let agent = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract(token_admin.clone());

    let contract_id = env.register_contract(None, RemitLastMileContract);
    let client = RemitLastMileContractClient::new(&env, &contract_id);

    client.register_agent(&agent, &symbol_short!("KemiShop"), &symbol_short!("LAGOS"));
    assert!(client.is_agent_registered(&agent));

    let token_client = token::StellarAssetClient::new(&env, &token_id);
    token_client.mint(&sender, &100_000);

    let secret = bytes!(&env, 0x0102030405);
    let secret_hash = env.crypto().sha256(&secret).to_bytes();

    let request_id = client.create_cashout_request(&sender, &token_id, &50_000_i128, &secret_hash);

    client.claim_cashout(&agent, &request_id, &secret);

    let request = client.get_request(&request_id);
    assert!(request.claimed);
    assert_eq!(request.claimed_by, Some(agent));
}

// TODO: test claim_cashout fails with InvalidSecret on wrong secret
// TODO: test claim_cashout fails with AlreadyClaimed on double-claim
// TODO: test claim_cashout fails with AgentNotRegistered for unregistered address
