import { ProposalOption } from "~/dummy/proposalOptions"
import { Proposal } from "~/dummy/proposals"
import { Card, CardContent } from "~/sushi-ui/components/card"
import { VoteModal } from "./VoteModal"
import { Space } from "~/dummy/spaces"

export function Vote({
  space,
  proposal,
  options
}: {
  space: Space
  proposal: Proposal
  options: ProposalOption[]
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg">Vote</h2>
      <div className="space-y-4">
        {options.map(option => (
          <div
            key={option.name}
            className="flex items-center space-y-2 w-full cursor-pointer"
          >
            <VoteModal space={space} proposal={proposal} option={option}>
              <Card className="w-full flex justify-center">
                <CardContent className="!p-3">{option.name}</CardContent>
              </Card>
            </VoteModal>
          </div>
        ))}
      </div>
    </div>
  )
}
