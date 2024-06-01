import {
  createActor as createBackendActor,
  canisterId as backendCanisterId
} from "../declarations/backend"

export const makeActor = (
  canisterId: string,
  createActor: typeof createBackendActor
) => {
  return createActor(canisterId, {
    agentOptions: {
      host: process.env.NEXT_PUBLIC_IC_HOST as string
    }
  })
}

export function makeBackendActor() {
  const canisterId = process.env.NEXT_PUBLIC_CANISTER_ID
  return makeActor(canisterId ?? "", createBackendActor)
}

export const backendActor = makeBackendActor()
