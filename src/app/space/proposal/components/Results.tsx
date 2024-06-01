import { Card, CardContent, CardHeader } from "~/sushi-ui/components/card"
import { ProposalOptionVote } from "~/dummy/proposalOptionVotes"
import { ProposalOption } from "~/dummy/options"
import { useMemo } from "react"

interface ResultsProps {
  options: ProposalOption[]
  optionVotes: ProposalOptionVote[]
}

export function Results({ options, optionVotes }: ResultsProps) {
  const totalPower = useMemo(
    () => optionVotes.reduce((acc, vote) => acc + vote.power, 0n),
    [optionVotes]
  )

  const optionsWithVotes = useMemo(() => {
    return options.map(option => {
      const optionPower = optionVotes.reduce((acc, vote) => {
        if (vote.option.name === option.name) {
          return acc + vote.power
        }
        return acc
      }, 0n)

      return {
        name: option.name,
        power: optionPower,
        percentage: (Number(optionPower) / Number(totalPower)) * 100
      }
    })
  }, [optionVotes, options, totalPower])

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <h2 className="text-lg">Results</h2>
      </CardHeader>
      <CardContent>
        {optionsWithVotes.map(option => (
          <div className="flex justify-between" key={option.name}>
            <div className="font-semibold">{option.name}</div>
            <div>{option.percentage.toFixed(2)}%</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
