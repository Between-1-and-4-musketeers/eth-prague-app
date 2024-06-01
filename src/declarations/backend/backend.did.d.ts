import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface BtcStrategy { 'id' : bigint, 'runeId' : string }
export type Error = { 'CanisterError' : { 'message' : string } } |
  { 'InvalidCanister' : null };
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
  'get_proposals_voting_power' : ActorMethod<[QueryParams], Result>,
  'insert_btc_strategy' : ActorMethod<[InsertBtcStrategy], Result>,
  'insert_evm_strategy' : ActorMethod<[InsertEvmStrategy], Result>,
  'insert_space' : ActorMethod<[Space], Result>,
  'query_all_spaces' : ActorMethod<[QueryParams], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
