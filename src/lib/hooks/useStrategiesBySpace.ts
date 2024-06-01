import { useQuery } from "@tanstack/react-query"
import {
  BtcStrategy,
  EvmStrategy,
  Strategy,
  btcStrategySchema,
  evmStrategySchema
} from "~/dummy/strategies"
import { backendActor } from "~/service/actor-locator"
import { parseDfinityResult } from "../parse-dfinity-result"
import { z } from "zod"

export function useStrategiesBySpace(
  _spaceId: number | string | null | undefined
) {
  const spaceId =
    _spaceId !== null && _spaceId !== undefined ? Number(_spaceId) : null

  return useQuery<Strategy[]>({
    queryKey: ["strategies-by-space", spaceId],
    queryFn: async () => {
      const [evmResult, btcResult] = await Promise.all([
        backendActor.get_all_evm_strategies_by_space_id({
          id: spaceId!
        }),
        backendActor.get_all_btc_strategies_by_space_id({
          id: spaceId!
        })
      ])
      const evmData = parseDfinityResult(evmResult)
      const evmStrategies: EvmStrategy[] = z
        .array(evmStrategySchema)
        .parse(evmData)

      const btcData = parseDfinityResult(btcResult)
      const btcStrategies: BtcStrategy[] = z
        .array(btcStrategySchema)
        .parse(btcData)

      return [...evmStrategies, ...btcStrategies]
    },
    enabled: typeof spaceId === "number"
  })
}
