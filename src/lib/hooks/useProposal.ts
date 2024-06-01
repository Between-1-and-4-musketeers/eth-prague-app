import { useQuery } from "@tanstack/react-query"
import { Proposal, proposalSchema } from "~/dummy/proposals"
import { backendActor } from "~/service/actor-locator"
import { parseDfinityResult } from "../parse-dfinity-result"

export function useProposal(_proposalId: number | string | null | undefined) {
  const proposalId =
    _proposalId !== null && _proposalId !== undefined
      ? Number(_proposalId)
      : null

  return useQuery<Proposal>({
    queryKey: ["proposal", proposalId],
    queryFn: async () => {
      const result = await backendActor.query_proposal_by_id({
        id: proposalId!
      })

      const data = parseDfinityResult(result)

      return proposalSchema.parse(data)
    },
    enabled: typeof proposalId === "number"
  })
}
