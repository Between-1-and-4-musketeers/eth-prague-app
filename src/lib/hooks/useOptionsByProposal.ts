import { useQuery } from "@tanstack/react-query"
import { ProposalOption, dummyProposalOptions } from "~/dummy/proposalOptions"

export function useOptionsByProposal(
  _proposalId: number | string | null | undefined
) {
  const proposalId =
    _proposalId !== null && _proposalId !== undefined
      ? Number(_proposalId)
      : null

  return useQuery<ProposalOption[]>({
    queryKey: ["options-by-proposal", proposalId],
    queryFn: async () => {
      return dummyProposalOptions
    },
    enabled: typeof proposalId === "number"
  })
}
