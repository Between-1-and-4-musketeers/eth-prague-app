import { useQuery } from "@tanstack/react-query"
import { Space, dummySpaces } from "~/dummy/spaces"

export function useSpaces() {
  return useQuery<Space[]>({
    queryKey: ["spaces"],
    queryFn: async () => {
      return dummySpaces
    }
  })
}
