import { z } from "zod"
import { Type } from "./type"

export type ProposalOptionVote = {
  address: string
  type: Type
  timestamp: number
  signature: string
  power: bigint
  optionId: number
}

export const voteSchema = z
  .object({
    id: z.number(),
    signature: z.string(),
    optionId: z.number(),
    voteType: z.number(),
    votingPower: z.number(),
    userAddress: z.string(),
    timestamp: z.number()
  })
  .transform(vote => ({
    ...vote,
    address: vote.userAddress,
    type: vote.userAddress.startsWith("0x") ? Type.EVM : Type.BTC,
    power: BigInt(vote.votingPower)
  }))

export const dummyProposalOptionVotes: ProposalOptionVote[] = [
  {
    address: "0x1",
    type: Type.EVM,
    timestamp: 1620000000,
    signature: "0x123",
    power: 10000000n,
    optionId: 0
  },
  {
    address: "0x2",
    type: Type.EVM,
    timestamp: 1620000000,
    signature: "0x123",
    power: 250000000n,
    optionId: 0
  },
  {
    address: "0x3",
    type: Type.EVM,
    timestamp: 1620000000,
    signature: "0x123",
    power: 300000000n,
    optionId: 1
  }
]
