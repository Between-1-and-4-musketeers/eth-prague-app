import { useQuery } from "@tanstack/react-query"
import { Space, spaceSchema } from "~/dummy/spaces"
import { parseDfinityResult } from "../parse-dfinity-result"
import { backendActor } from "~/service/actor-locator"
import { z } from "zod"

export function useSpaces() {
  return useQuery<Space[]>({
    queryKey: ["spaces"],
    queryFn: async () => {
      const result = await backendActor.query_all_spaces({
        limit: 1000,
        offset: 0
      })

      const data = parseDfinityResult(result)

      return z.array(spaceSchema).parse(data)
    }
  })
}
