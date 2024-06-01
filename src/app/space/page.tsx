"use client"

import { useEffect, useState } from "react"
import { Proposals } from "./components/Tabs/Proposals"
import { Strategies } from "./components/Tabs/Strategies"
import { Sidebar } from "./components/Sidebar"
import { useSearchParams } from "next/navigation"
import { useProposalsBySpace } from "~/lib/hooks/useProposalsBySpace"
import { useSpace } from "~/lib/hooks/useSpace"
import { useStrategiesBySpace } from "~/lib/hooks/useStrategiesBySpace"
import { Events } from "./components/Tabs/Events"

const tabs = ["Proposals", "Strategies", "Events"] as const

export default function SpacePage() {
  const [currentTab, setTab] = useState<(typeof tabs)[number]>(tabs[0])
  const [isMounted, setIsMounted] = useState(false)

  const params = useSearchParams()

  const { data: space, isInitialLoading: isSpaceLoading } = useSpace(
    params.get("spaceId")
  )
  const { data: proposals, isInitialLoading: isProposalsLoading } =
    useProposalsBySpace(params.get("spaceId"))
  const { data: strategies, isInitialLoading: isStrategiesLoading } =
    useStrategiesBySpace(params.get("spaceId"))

  useEffect(() => {
    if (typeof window !== "undefined") {
      window
      setIsMounted(true)
    }
  }, [])

  if (!isMounted || isSpaceLoading || isProposalsLoading || isStrategiesLoading)
    return <div>Loading...</div>

  if (!space) return <div>Space not found</div>
  if (!proposals) return <div>Proposals not found</div>
  if (!strategies) return <div>Strategies not found</div>

  return (
    <div className="grid grid-cols-5 gap-8 w-full">
      <Sidebar
        space={space}
        currentTab={currentTab}
        setTab={setTab}
        tabs={tabs}
      />
      <div className="col-span-4">
        <div />
        {currentTab === "Proposals" ? (
          <Proposals space={space} proposals={proposals} />
        ) : null}
        {currentTab === "Strategies" ? (
          <Strategies strategies={strategies} />
        ) : null}
        {currentTab === "Events" ? <Events space={space} /> : null}
      </div>
    </div>
  )
}
