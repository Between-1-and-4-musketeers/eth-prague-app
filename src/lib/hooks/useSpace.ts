import { useQuery } from "@tanstack/react-query"
import { Space, dummySpaces } from "~/dummy/spaces"

export function useSpace(_spaceId: number | string | null | undefined) {
  const spaceId =
    _spaceId !== null && _spaceId !== undefined ? Number(_spaceId) : null

  return useQuery<Space>({
    queryKey: ["space", spaceId],
    queryFn: async () => {
      return dummySpaces.find(space => space.id === Number(spaceId))!
    },
    enabled: typeof spaceId === "number"
  })
}
