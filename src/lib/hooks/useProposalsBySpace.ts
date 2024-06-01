import { useQuery } from "@tanstack/react-query"
import { Proposal, proposalSchema } from "~/dummy/proposals"
import { backendActor } from "~/service/actor-locator"
import { parseDfinityResult } from "../parse-dfinity-result"
import { z } from "zod"

export function useProposalsBySpace(
  _spaceId: number | string | null | undefined
) {
  const spaceId =
    _spaceId !== null && _spaceId !== undefined ? Number(_spaceId) : null

  return useQuery<Proposal[]>({
    queryKey: ["proposals-by-space", spaceId],
    queryFn: async () => {
      const result = await backendActor.query_proposals_by_space_id({
        id: spaceId!
      })

      const data = parseDfinityResult(result)

      return z.array(proposalSchema).parse(data)
    },
    enabled: typeof spaceId === "number"
  })
}
