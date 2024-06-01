export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    'CanisterError' : IDL.Record({ 'message' : IDL.Text }),
    'InvalidCanister' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : Error });
  const GetByIdParams = IDL.Record({ 'id' : IDL.Nat64 });
  const GetByAdressAndIdParams = IDL.Record({
    'id' : IDL.Nat64,
    'address' : IDL.Text,
  });
  const InsertBtcStrategy = IDL.Record({
    'runeId' : IDL.Text,
    'name' : IDL.Text,
    'spaceId' : IDL.Nat64,
  });
  const InsertEvmStrategy = IDL.Record({
    'name' : IDL.Text,
    'configString' : IDL.Text,
    'spaceId' : IDL.Nat64,
    'chainId' : IDL.Nat64,
    'contactAddress' : IDL.Text,
  });
  const InsertProposalOptionVote = IDL.Record({
    'signature' : IDL.Text,
    'optionId' : IDL.Nat64,
    'voteType' : IDL.Text,
    'votingPower' : IDL.Nat64,
    'userAddress' : IDL.Text,
    'timestamp' : IDL.Nat64,
  });
  const InsertProposolaWithOption = IDL.Record({
    'title' : IDL.Text,
    'mechanism' : IDL.Text,
    'dateCreated' : IDL.Nat64,
    'description' : IDL.Text,
    'spaceId' : IDL.Nat64,
    'commaSeparatedOptions' : IDL.Text,
  });
  const Space = IDL.Record({
    'id' : IDL.Nat64,
    'websiteLink' : IDL.Text,
    'name' : IDL.Text,
    'minVoteRole' : IDL.Nat64,
    'iconLink' : IDL.Text,
    'voteDuration' : IDL.Nat64,
    'voteDelay' : IDL.Nat64,
    'minVotePower' : IDL.Nat64,
    'quorum' : IDL.Nat64,
  });
  const QueryParams = IDL.Record({ 'offset' : IDL.Nat64, 'limit' : IDL.Nat64 });
  return IDL.Service({
    'create' : IDL.Func([], [Result], []),
    'drop' : IDL.Func([], [Result], []),
    'get_all_btc_strategies_by_space_id' : IDL.Func(
        [GetByIdParams],
        [Result],
        ['query'],
      ),
    'get_all_evm_strategies_by_space_id' : IDL.Func(
        [GetByIdParams],
        [Result],
        ['query'],
      ),
    'get_proposal_option_by_user_adress_and_proposal_id' : IDL.Func(
        [GetByAdressAndIdParams],
        [Result],
        ['query'],
      ),
    'get_proposals_with_voting_power_by_proposal_id' : IDL.Func(
        [GetByIdParams],
        [Result],
        ['query'],
      ),
    'insert_btc_strategy' : IDL.Func([InsertBtcStrategy], [Result], []),
    'insert_evm_strategy' : IDL.Func([InsertEvmStrategy], [Result], []),
    'insert_proposal_option_vote' : IDL.Func(
        [InsertProposalOptionVote],
        [Result],
        [],
      ),
    'insert_proposal_with_option' : IDL.Func(
        [InsertProposolaWithOption],
        [Result],
        [],
      ),
    'insert_space' : IDL.Func([Space], [Result], []),
    'query_all_spaces' : IDL.Func([QueryParams], [Result], ['query']),
    'query_proposal_by_id' : IDL.Func([GetByIdParams], [Result], ['query']),
    'query_proposals_by_space_id' : IDL.Func(
        [GetByIdParams],
        [Result],
        ['query'],
      ),
    'query_spaces_by_id' : IDL.Func([GetByIdParams], [Result], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
