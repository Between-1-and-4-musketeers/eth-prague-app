import { useQuery } from "@tanstack/react-query"
import { Event, eventSchema } from "~/dummy/events"
import { backendActor } from "~/service/actor-locator"
import { parseDfinityResult } from "../parse-dfinity-result"
import { z } from "zod"

export function useEventsBySpace(_spaceId: number | string | null | undefined) {
  const spaceId =
    _spaceId !== null && _spaceId !== undefined ? Number(_spaceId) : null

  return useQuery<Event[]>({
    queryKey: ["events-by-space", spaceId],
    queryFn: async () => {
      const result = await backendActor.get_all_space_events_by_space_id({
        id: spaceId!
      })

      const data = parseDfinityResult(result)

      return z.array(eventSchema).parse(data)
    },
    enabled: typeof spaceId === "number"
  })
}
