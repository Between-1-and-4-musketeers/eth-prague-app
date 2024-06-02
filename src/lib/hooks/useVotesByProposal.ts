import { useQuery } from "@tanstack/react-query"
import { ProposalOptionVote, voteSchema } from "~/dummy/votes"
import { backendActor } from "~/service/actor-locator"
import { parseDfinityResult } from "../parse-dfinity-result"
import { z } from "zod"

export function useVotesByProposal(
  _proposalId: number | string | null | undefined
) {
  const proposalId =
    _proposalId !== null && _proposalId !== undefined
      ? Number(_proposalId)
      : null

  return useQuery<ProposalOptionVote[]>({
    queryKey: ["votes-by-proposal", Number(proposalId)],
    queryFn: async () => {
      const result = await backendActor.get_proposal_votes_by_proposal_id({
        id: proposalId!
      })

      const data = parseDfinityResult(result)

      return z.array(voteSchema).parse(data)
    },
    enabled: typeof proposalId === "number"
  })
}
