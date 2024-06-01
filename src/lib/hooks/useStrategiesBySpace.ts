import { useQuery } from "@tanstack/react-query"
import { Strategy, dummyStrategies } from "~/dummy/strategies"

export function useStrategiesBySpace(
  _spaceId: number | string | null | undefined
) {
  const spaceId =
    _spaceId !== null && _spaceId !== undefined ? Number(_spaceId) : null

  return useQuery<Strategy[]>({
    queryKey: ["strategies-by-space", spaceId],
    queryFn: async () => {
      return dummyStrategies
    },
    enabled: typeof spaceId === "number"
  })
}
