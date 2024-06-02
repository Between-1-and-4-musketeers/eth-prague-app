import { useQuery } from "@tanstack/react-query"

interface UseVotingPower {
  voter: string
  spaceId: number
  blockNumber?: number | undefined
}

export function useVotingPower({
  blockNumber,
  spaceId,
  voter
}: UseVotingPower) {
  return useQuery({
    queryKey: ["voting-power", voter, spaceId, blockNumber],
    queryFn: async () => {
      let url = process.env.NEXT_PUBLIC_BACKEND_API

      if (!url) throw new Error("Backend API URL is not defined")

      if (blockNumber) {
        url += `/api/power?address=${voter}&spaceId=${spaceId}&blockNumber=${blockNumber}`
      } else {
        url += `/api/power?address=${voter}&spaceId=${spaceId}`
      }

      const res: { votingPower: string } = await fetch(url).then(res =>
        res.json()
      )

      return BigInt(res.votingPower)
    }
  })
}
