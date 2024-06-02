import { useQuery } from "@tanstack/react-query"
import { ProposalOption, optionSchema } from "~/dummy/options"
import { backendActor } from "~/service/actor-locator"
import { parseDfinityResult } from "../parse-dfinity-result"
import { z } from "zod"

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
      const result = await backendActor.get_proposal_options_by_proposal_id({
        id: proposalId!
      })

      const data = parseDfinityResult(result)

      return z.array(optionSchema).parse(data)
    },
    enabled: typeof proposalId === "number"
  })
}
