import { z } from "zod"

export type ProposalOption = BaseOption | ExecuteOption

type BaseOption = {
  id: number
  name: string
  proposalId: number
}

export type ExecuteOption = BaseOption & {
  onWinContractAddress: string
  onWinByteCode: string
  onWinChainId: number
}

export const optionSchema = z.object({
  id: z.number(),
  name: z.string(),
  onWinContractAddress: z.string().optional(),
  onWinByteCode: z.string().optional(),
  onWinChainId: z.number().optional()
})

export const dummyProposalOptions: ProposalOption[] = [
  {
    id: 0,
    proposalId: 0,
    name: "Yes",
    onWinChainId: 123456,
    onWinContractAddress: "0x123456789",
    onWinByteCode: "0x123456789"
  },
  {
    id: 1,
    proposalId: 0,
    name: "No"
  },
  {
    id: 2,
    proposalId: 0,
    name: "Abstain"
  }
]
