export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    'CanisterError' : IDL.Record({ 'message' : IDL.Text }),
    'InvalidCanister' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : Error });
  const QueryParams = IDL.Record({ 'offset' : IDL.Nat64, 'limit' : IDL.Nat64 });
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
  const GetByIdParams = IDL.Record({ 'id' : IDL.Nat64 });
  return IDL.Service({
    'create' : IDL.Func([], [Result], []),
    'drop' : IDL.Func([], [Result], []),
    'get_proposals_voting_power' : IDL.Func([QueryParams], [Result], ['query']),
    'insert_btc_strategy' : IDL.Func([InsertBtcStrategy], [Result], []),
    'insert_evm_strategy' : IDL.Func([InsertEvmStrategy], [Result], []),
    'insert_proposal_with_option' : IDL.Func(
        [InsertProposolaWithOption],
        [Result],
        [],
      ),
    'insert_space' : IDL.Func([Space], [Result], []),
    'query_all_spaces' : IDL.Func([QueryParams], [Result], ['query']),
    'query_proposals_by_space_id' : IDL.Func(
        [GetByIdParams],
        [Result],
        ['query'],
      ),
    'query_spaces_by_id' : IDL.Func([GetByIdParams], [Result], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
