import { useQuery } from "@tanstack/react-query"
import {
  ProposalOptionVote,
  dummyProposalOptionVotes
} from "~/dummy/proposalOptionVotes"

export function useVotesByProposal(
  _proposalId: number | string | null | undefined
) {
  const proposalId =
    _proposalId !== null && _proposalId !== undefined
      ? Number(_proposalId)
      : null

  return useQuery<ProposalOptionVote[]>({
    queryKey: ["votes-by-proposal", proposalId],
    queryFn: async () => {
      return dummyProposalOptionVotes
    },
    enabled: typeof proposalId === "number"
  })
}
