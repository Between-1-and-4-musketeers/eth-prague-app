import { z } from "zod"
import { Type } from "./type"

export type EvmStrategy = {
  type: Type.EVM
  address: string
  chainId: number
  config: string
} & BaseStrategy

export function isEvmStrategy(strategy: Strategy): strategy is EvmStrategy {
  return strategy.type === Type.EVM
}

export const evmStrategySchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    contractAddress: z.string(),
    chainId: z.number(),
    configString: z.string()
  })
  .transform(strategy => ({
    ...strategy,
    address: strategy.contractAddress,
    config: strategy.configString,
    type: Type.EVM as const
  }))

export type BtcStrategy = {
  type: Type.BTC
  runeId: number
} & BaseStrategy

export function isBtcStrategy(strategy: Strategy): strategy is BtcStrategy {
  return strategy.type === Type.BTC
}

export const btcStrategySchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    runeId: z.number()
  })
  .transform(strategy => ({
    ...strategy,
    type: Type.BTC as const
  }))

type BaseStrategy = {
  id: number
  name: string
  description: string
  type: Type
}

export type Strategy = EvmStrategy | BtcStrategy

export const dummyStrategies: Strategy[] = [
  {
    id: 0,
    name: "EVM Strat",
    description:
      "EVM Strategy lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    type: Type.EVM,
    address: "0x123",
    chainId: 1,
    config: "0x123ajbd$voter."
  },
  {
    id: 1,
    name: "BTC Ordinal",
    description: "BTC Ordinal Strategy",
    type: Type.BTC,
    runeId: 1
  }
]
