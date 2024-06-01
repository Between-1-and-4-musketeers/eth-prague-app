import { useQuery } from "@tanstack/react-query"
import { Proposal, dummyProposals } from "~/dummy/proposals"

export function useProposalsBySpace(
  _spaceId: number | string | null | undefined
) {
  const spaceId =
    _spaceId !== null && _spaceId !== undefined ? Number(_spaceId) : null

  return useQuery<Proposal[]>({
    queryKey: ["proposals-by-space", spaceId],
    queryFn: async () => {
      return dummyProposals
    },
    enabled: typeof spaceId === "number"
  })
}
