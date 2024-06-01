import { ProposalOption, dummyProposalOptions } from "./proposalOptions"
import { Type } from "./type"

export type ProposalOptionVote = {
  address: string
  type: Type
  timestamp: number
  signature: string
  power: bigint
  option: ProposalOption
}

export const dummyProposalOptionVotes: ProposalOptionVote[] = [
  {
    address: "0x1",
    type: Type.EVM,
    timestamp: 1620000000,
    signature: "0x123",
    power: 10000000n,
    option: dummyProposalOptions[0]!
  },
  {
    address: "0x2",
    type: Type.EVM,
    timestamp: 1620000000,
    signature: "0x123",
    power: 250000000n,
    option: dummyProposalOptions[0]!
  },
  {
    address: "0x3",
    type: Type.EVM,
    timestamp: 1620000000,
    signature: "0x123",
    power: 300000000n,
    option: dummyProposalOptions[1]!
  }
]
