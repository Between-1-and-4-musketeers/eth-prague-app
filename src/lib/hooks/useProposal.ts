import { useQuery } from "@tanstack/react-query"
import { Proposal, dummyProposals } from "~/dummy/proposals"

export function useProposal(_proposalId: number | string | null | undefined) {
  const proposalId =
    _proposalId !== null && _proposalId !== undefined
      ? Number(_proposalId)
      : null

  return useQuery<Proposal>({
    queryKey: ["proposal", proposalId],
    queryFn: async () => {
      return dummyProposals.find(
        proposal => proposal.id === Number(proposalId)
      )!
    },
    enabled: typeof proposalId === "number"
  })
}
