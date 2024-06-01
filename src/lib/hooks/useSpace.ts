import { useQuery } from "@tanstack/react-query"
import { Space, spaceSchema } from "~/dummy/spaces"
import { backendActor } from "~/service/actor-locator"
import { parseDfinityResult } from "../parse-dfinity-result"

export function useSpace(_spaceId: number | string | null | undefined) {
  const spaceId =
    _spaceId !== null && _spaceId !== undefined ? Number(_spaceId) : null

  return useQuery<Space>({
    queryKey: ["space", spaceId],
    queryFn: async () => {
      const result = await backendActor.query_spaces_by_id({
        id: spaceId!
      })

      const data = parseDfinityResult(result)

      return spaceSchema.parse(data)
    },
    enabled: typeof spaceId === "number"
  })
}
