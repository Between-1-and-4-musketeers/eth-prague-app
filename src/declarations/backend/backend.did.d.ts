import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface BtcStrategy { 'id' : number, 'runeId' : string }
export type Error = { 'CanisterError' : { 'message' : string } } |
  { 'InvalidCanister' : null };
export interface GetBtcStrategy {
  'id' : number,
  'runeId' : string,
  'name' : string,
  'description' : string,
  'spaceId' : number,
}
export interface GetByAdressAndIdParams { 'id' : number, 'address' : string }
export interface GetByIdParams { 'id' : number }
export interface GetEvmStrategy {
  'id' : number,
  'name' : string,
  'description' : string,
  'configString' : string,
  'spaceId' : number,
  'chainId' : bigint,
  'contractAddress' : string,
}
export interface InsertBtcStrategy {
  'runeId' : string,
  'name' : string,
  'spaceId' : number,
}
export interface InsertEvmStrategy {
  'name' : string,
  'description' : string,
  'configString' : string,
  'spaceId' : number,
  'chainId' : bigint,
  'contractAddress' : string,
}
export interface InsertProposalBlock {
  'blocknumber' : number,
  'voteType' : number,
  'chainId' : [] | [bigint],
  'proposalID' : number,
}
export interface InsertProposalOptionVote {
  'signature' : string,
  'optionId' : number,
  'voteType' : number,
  'votingPower' : bigint,
  'userAddress' : string,
  'timestamp' : number,
}
export interface InsertProposolaWithOption {
  'title' : string,
  'mechanism' : number,
  'dateCreated' : number,
  'description' : string,
  'spaceId' : number,
  'commaSeparatedOptions' : string,
}
export interface Proposal {
  'id' : number,
  'title' : string,
  'mechanism' : number,
  'dateCreated' : number,
  'description' : string,
  'spaceId' : number,
}
export interface ProposalOption {
  'id' : number,
  'name' : string,
  'proposalId' : number,
}
export interface ProposalOptionVote {
  'id' : number,
  'signature' : string,
  'optionId' : number,
  'voteType' : number,
  'votingPower' : bigint,
  'userAddress' : string,
  'timestamp' : number,
}
export interface QueryParams { 'offset' : number, 'limit' : number }
export type Result = { 'Ok' : string } |
  { 'Err' : Error };
export interface Space {
  'id' : number,
  'websiteLink' : string,
  'name' : string,
  'minVoteRole' : number,
  'iconLink' : string,
  'voteDuration' : number,
  'voteDelay' : number,
  'minVotePower' : bigint,
  'quorum' : number,
}
export interface Strategy {
  'id' : number,
  'name' : string,
  'evmId' : number,
  'spaceId' : number,
  'btcId' : number,
}
export interface _SERVICE {
  'create' : ActorMethod<[], Result>,
  'delete_proposal' : ActorMethod<[GetByIdParams], Result>,
  'delete_proposal_block' : ActorMethod<[GetByIdParams], Result>,
  'delete_proposal_option' : ActorMethod<[GetByIdParams], Result>,
  'delete_proposal_option_vote' : ActorMethod<[GetByIdParams], Result>,
  'delete_space' : ActorMethod<[GetByIdParams], Result>,
  'delete_strategy' : ActorMethod<[GetByIdParams], Result>,
  'drop' : ActorMethod<[], Result>,
  'get_all_btc_strategies_by_space_id' : ActorMethod<[GetByIdParams], Result>,
  'get_all_evm_strategies_by_space_id' : ActorMethod<[GetByIdParams], Result>,
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
  'insert_proposal_block' : ActorMethod<[InsertProposalBlock], Result>,
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
