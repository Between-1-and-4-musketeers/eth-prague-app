export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    'CanisterError' : IDL.Record({ 'message' : IDL.Text }),
    'InvalidCanister' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : Error });
  const Space = IDL.Record({
    'id' : IDL.Nat64,
    'websiteLink' : IDL.Text,
    'name' : IDL.Text,
    'iconLink' : IDL.Text,
    'voteDuration' : IDL.Nat64,
    'voteDelay' : IDL.Nat64,
    'quorum' : IDL.Nat64,
  });
  const QueryParams = IDL.Record({ 'offset' : IDL.Nat64, 'limit' : IDL.Nat64 });
  const FilterParams = IDL.Record({ 'title' : IDL.Text });
  const UpdateParams = IDL.Record({ 'id' : IDL.Nat64, 'title' : IDL.Text });
  return IDL.Service({
    'create' : IDL.Func([], [Result], []),
    'delete' : IDL.Func([IDL.Nat64], [Result], []),
    'insert' : IDL.Func([Space], [Result], []),
    'query' : IDL.Func([QueryParams], [Result], ['query']),
    'query_filter' : IDL.Func([FilterParams], [Result], ['query']),
    'update' : IDL.Func([UpdateParams], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
