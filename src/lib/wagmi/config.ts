import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "viem/chains"

export const chains = [mainnet, sepolia] as const

export const config = createConfig({
  chains,
  transports: {
    [chains[0].id]: http("https://eth.drpc.org"),
    [chains[1].id]: http("https://sepolia.drpc.org")
  }
})
