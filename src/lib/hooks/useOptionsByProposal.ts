import { useQuery } from "@tanstack/react-query"
import { ProposalOption, dummyProposalOptions } from "~/dummy/options"
import { backendActor } from "~/service/actor-locator"
import { parseDfinityResult } from "../parse-dfinity-result"

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
      // const result = await backendActor({

      // })

      // const data = parseDfinityResult(result)

      // return proposalSchema.parse(data)
    },
    enabled: typeof proposalId === "number"
  })
}
