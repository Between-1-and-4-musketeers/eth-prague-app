import { Strategy, isBtcStrategy, isEvmStrategy } from "~/dummy/strategies"
import { Card, CardContent, CardHeader } from "~/sushi-ui/components/card"

function StrategyContent({ strategy }: { strategy: Strategy }) {
  if (isEvmStrategy(strategy)) {
    return (
      <div className="space-y-6">
        <p className="text-sm">{strategy.description}</p>
        <div className="space-y-1 w-full">
          <div className="flex justify-between">
            <span className="font-semibold">Type:</span>
            <span>{strategy.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Address:</span>
            <span>{strategy.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Config:</span>
            <span>{strategy.config}</span>
          </div>
        </div>
      </div>
    )
  }

  if (isBtcStrategy(strategy)) {
    return (
      <div className="space-y-6">
        <p className="text-sm">{strategy.description}</p>
        <div className="space-y-1 w-full">
          <div className="flex justify-between">
            <span className="font-semibold">Type:</span>
            <span>{strategy.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Rune ID:</span>
            <span>{strategy.runeId}</span>
          </div>
        </div>
      </div>
    )
  }
}

export function Strategies({ strategies }: { strategies: Strategy[] }) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Strategies</h1>
      <div className="space-y-4">
        {strategies.map(strategy => (
          <div key={strategy.id}>
            <Card>
              <CardHeader>
                <h2 className="text-lg">{strategy.name}</h2>
              </CardHeader>
              <CardContent>
                <StrategyContent strategy={strategy} />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
