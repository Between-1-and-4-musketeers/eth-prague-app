export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    'CanisterError' : IDL.Record({ 'message' : IDL.Text }),
    'InvalidCanister' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : Error });
  const GetByIdParams = IDL.Record({ 'id' : IDL.Nat32 });
  const GetByAdressAndIdParams = IDL.Record({
    'id' : IDL.Nat32,
    'address' : IDL.Text,
  });
  const InsertBtcStrategy = IDL.Record({
    'runeId' : IDL.Text,
    'name' : IDL.Text,
    'spaceId' : IDL.Nat32,
  });
  const InsertEvmStrategy = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Text,
    'configString' : IDL.Text,
    'spaceId' : IDL.Nat32,
    'chainId' : IDL.Nat64,
    'contractAddress' : IDL.Text,
  });
  const InsertProposalBlock = IDL.Record({
    'blocknumber' : IDL.Nat32,
    'voteType' : IDL.Nat32,
    'chainId' : IDL.Opt(IDL.Nat64),
    'proposalID' : IDL.Nat32,
  });
  const InsertProposalOptionVote = IDL.Record({
    'signature' : IDL.Text,
    'optionId' : IDL.Nat32,
    'voteType' : IDL.Nat32,
    'votingPower' : IDL.Nat64,
    'userAddress' : IDL.Text,
    'timestamp' : IDL.Nat32,
  });
  const InsertProposolaWithOption = IDL.Record({
    'title' : IDL.Text,
    'mechanism' : IDL.Nat32,
    'dateCreated' : IDL.Nat32,
    'description' : IDL.Text,
    'spaceId' : IDL.Nat32,
    'commaSeparatedOptions' : IDL.Opt(IDL.Text),
  });
  const Space = IDL.Record({
    'id' : IDL.Nat32,
    'websiteLink' : IDL.Text,
    'name' : IDL.Text,
    'minVoteRole' : IDL.Nat32,
    'iconLink' : IDL.Text,
    'voteDuration' : IDL.Nat32,
    'voteDelay' : IDL.Nat32,
    'minVotePower' : IDL.Nat64,
    'quorum' : IDL.Nat32,
  });
  const SpaceEvent = IDL.Record({
    'id' : IDL.Nat32,
    'eventtype' : IDL.Nat32,
    'spaceId' : IDL.Nat32,
    'payload' : IDL.Text,
    'webhookUrl' : IDL.Text,
  });
  const QueryParams = IDL.Record({ 'offset' : IDL.Nat32, 'limit' : IDL.Nat32 });
  return IDL.Service({
    'create' : IDL.Func([], [Result], []),
    'delete_proposal' : IDL.Func([GetByIdParams], [Result], []),
    'delete_proposal_block' : IDL.Func([GetByIdParams], [Result], []),
    'delete_proposal_option' : IDL.Func([GetByIdParams], [Result], []),
    'delete_proposal_option_vote' : IDL.Func([GetByIdParams], [Result], []),
    'delete_space' : IDL.Func([GetByIdParams], [Result], []),
    'delete_space_event' : IDL.Func([GetByIdParams], [Result], []),
    'delete_strategy' : IDL.Func([GetByIdParams], [Result], []),
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
    'get_all_space_events' : IDL.Func([], [Result], ['query']),
    'get_all_space_events_by_space_id' : IDL.Func(
        [GetByIdParams],
        [Result],
        ['query'],
      ),
    'get_proposal_option_by_user_adress_and_proposal_id' : IDL.Func(
        [GetByAdressAndIdParams],
        [Result],
        ['query'],
      ),
    'get_proposal_options_by_proposal_id' : IDL.Func(
        [GetByIdParams],
        [Result],
        ['query'],
      ),
    'get_proposal_votes_by_proposal_id' : IDL.Func(
        [GetByIdParams],
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
    'insert_proposal_block' : IDL.Func([InsertProposalBlock], [Result], []),
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
    'insert_space_event' : IDL.Func([SpaceEvent], [Result], []),
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
