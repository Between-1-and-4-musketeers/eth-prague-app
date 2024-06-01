import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Error = { 'CanisterError' : { 'message' : string } } |
  { 'InvalidCanister' : null };
export interface FilterParams { 'title' : string }
export interface QueryParams { 'offset' : bigint, 'limit' : bigint }
export type Result = { 'Ok' : string } |
  { 'Err' : Error };
export interface Space {
  'id' : bigint,
  'websiteLink' : string,
  'name' : string,
  'iconLink' : string,
  'voteDuration' : bigint,
  'voteDelay' : bigint,
  'quorum' : bigint,
}
export interface UpdateParams { 'id' : bigint, 'title' : string }
export interface _SERVICE {
  'create' : ActorMethod<[], Result>,
  'delete' : ActorMethod<[bigint], Result>,
  'insert' : ActorMethod<[Space], Result>,
  'query' : ActorMethod<[QueryParams], Result>,
  'query_filter' : ActorMethod<[FilterParams], Result>,
  'update' : ActorMethod<[UpdateParams], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
