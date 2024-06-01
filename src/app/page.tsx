"use client"

import { SpacesGrid } from "./components/SpacesGrid"
import { useSpaces } from "~/lib/hooks/useSpaces"

export default function HomePage() {
  const { data: spaces, isInitialLoading } = useSpaces()

  if (!spaces || isInitialLoading) return <div>Loading...</div>

  return (
    <main className="">
      <SpacesGrid spaces={spaces} />
    </main>
  )
}
