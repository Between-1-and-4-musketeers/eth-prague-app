import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface BtcStrategy { 'id' : bigint, 'runeId' : string }
export type Error = { 'CanisterError' : { 'message' : string } } |
  { 'InvalidCanister' : null };
export interface GetByAdressAndIdParams { 'id' : bigint, 'address' : string }
export interface GetByIdParams { 'id' : bigint }
export interface InsertBtcStrategy {
  'runeId' : string,
  'name' : string,
  'spaceId' : bigint,
}
export interface InsertEvmStrategy {
  'name' : string,
  'configString' : string,
  'spaceId' : bigint,
  'chainId' : bigint,
  'contactAddress' : string,
}
export interface InsertProposalOptionVote {
  'signature' : string,
  'optionId' : bigint,
  'voteType' : string,
  'votingPower' : bigint,
  'userAddress' : string,
  'timestamp' : bigint,
}
export interface InsertProposolaWithOption {
  'title' : string,
  'mechanism' : string,
  'dateCreated' : bigint,
  'description' : string,
  'spaceId' : bigint,
  'commaSeparatedOptions' : string,
}
export interface Proposal {
  'id' : bigint,
  'title' : string,
  'mechanism' : string,
  'dateCreated' : bigint,
  'description' : string,
  'spaceId' : bigint,
}
export interface ProposalOption {
  'id' : bigint,
  'name' : string,
  'proposalId' : bigint,
}
export interface ProposalOptionVote {
  'id' : bigint,
  'signature' : string,
  'optionId' : bigint,
  'voteType' : string,
  'votingPower' : bigint,
  'userAddress' : string,
  'timestamp' : bigint,
}
export interface QueryParams { 'offset' : bigint, 'limit' : bigint }
export type Result = { 'Ok' : string } |
  { 'Err' : Error };
export interface Space {
  'id' : bigint,
  'websiteLink' : string,
  'name' : string,
  'minVoteRole' : bigint,
  'iconLink' : string,
  'voteDuration' : bigint,
  'voteDelay' : bigint,
  'minVotePower' : bigint,
  'quorum' : bigint,
}
export interface Strategy {
  'id' : bigint,
  'name' : string,
  'evmId' : bigint,
  'spaceId' : bigint,
  'btcId' : bigint,
}
export interface _SERVICE {
  'create' : ActorMethod<[], Result>,
  'drop' : ActorMethod<[], Result>,
  'get_proposal_option_by_user_adress_and_proposal_id' : ActorMethod<
    [GetByAdressAndIdParams],
    Result
  >,
  'get_proposals_with_voting_power_by_proposal_id' : ActorMethod<
    [GetByIdParams],
    Result
  >,
  'insert_btc_strategy' : ActorMethod<[InsertBtcStrategy], Result>,
  'insert_evm_strategy' : ActorMethod<[InsertEvmStrategy], Result>,
  'insert_proposal_option_vote' : ActorMethod<
    [InsertProposalOptionVote],
    Result
  >,
  'insert_proposal_with_option' : ActorMethod<
    [InsertProposolaWithOption],
    Result
  >,
  'insert_space' : ActorMethod<[Space], Result>,
  'query_all_spaces' : ActorMethod<[QueryParams], Result>,
  'query_proposal_by_id' : ActorMethod<[GetByIdParams], Result>,
  'query_proposals_by_space_id' : ActorMethod<[GetByIdParams], Result>,
  'query_spaces_by_id' : ActorMethod<[GetByIdParams], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
