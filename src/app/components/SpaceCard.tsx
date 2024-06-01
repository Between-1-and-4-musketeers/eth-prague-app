import Link from "next/link"
import { Space } from "~/dummy/spaces"
import { Card, CardContent } from "~/sushi-ui/components/card"

export function SpaceCard({ space }: { space: Space }) {
  return (
    <Link href={`/space?spaceId=${space.id}`}>
      <Card className="select-none px-4">
        <CardContent className="flex justify-center items-center pt-6">
          <div>
            <img width={96} height={96} src={space.iconLink} alt={space.name} />
          </div>
          <div className="text-xl font-semibold">{space.name}</div>
        </CardContent>
      </Card>
    </Link>
  )
}
