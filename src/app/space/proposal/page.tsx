"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Body } from "./components/Body"
import { Information } from "./components/Information"
import { Results } from "./components/Results"
import { Votes } from "./components/Votes"
import { Vote } from "./components/Vote/Vote"
import { useSpace } from "~/lib/hooks/useSpace"
import { useProposal } from "~/lib/hooks/useProposal"
import { useVotesByProposal } from "~/lib/hooks/useVotesByProposal"
import { useOptionsByProposal } from "~/lib/hooks/useOptionsByProposal"

export default function SpacePage() {
  const [isMounted, setIsMounted] = useState(false)

  const params = useSearchParams()

  const { data: space, isInitialLoading: isSpaceLoading } = useSpace(
    params.get("spaceId")
  )

  const { data: proposal, isInitialLoading: isProposalLoading } = useProposal(
    params.get("proposalId")
  )

  const {
    data: votes,
    isInitialLoading: isVotesLoading,
    error
  } = useVotesByProposal(params.get("proposalId"))

  console.log(votes, error)

  const { data: options, isInitialLoading: isOptionsLoading } =
    useOptionsByProposal(params.get("proposalId"))

  useEffect(() => {
    if (typeof window !== "undefined") {
      window
      setIsMounted(true)
    }
  }, [])

  if (
    !isMounted ||
    isSpaceLoading ||
    isProposalLoading ||
    isVotesLoading ||
    isOptionsLoading
  )
    return <div>Loading...</div>

  if (!space) return <div>Space not found</div>
  if (!proposal) return <div>Proposal not found</div>
  if (!votes) return <div>Votes not found</div>
  if (!options) return <div>Options not found</div>

  return (
    <div className="flex justify-center w-full">
      <div className="max-w-4xl space-y-4">
        <h1 className="text-2xl font-semibold">{proposal.title}</h1>
        <div className="grid grid-cols-5 gap-8 w-full">
          <div className="col-span-3 space-y-6">
            <Body content={proposal.description} />
            <Vote space={space} proposal={proposal} options={options} />
            <Votes optionVotes={votes} />
          </div>
          <div className="col-span-2 space-y-6">
            <Information space={space} proposal={proposal} />
            <Results options={options} optionVotes={votes} />
          </div>
        </div>
      </div>
    </div>
  )
}
