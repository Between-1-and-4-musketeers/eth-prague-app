import classNames from "classnames"
import { Space } from "~/dummy/spaces"
import { Card, CardContent, CardHeader } from "~/sushi-ui/components/card"

interface SidebarProps<T extends Readonly<string[]>> {
  space: Space
  setTab: (tab: T[number]) => void
  currentTab: T[number]
  tabs: T
}

export function Sidebar<T extends Readonly<string[]>>({
  space,
  currentTab,
  setTab,
  tabs
}: SidebarProps<T>) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <h2 className="text-lg">{space.name}</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tabs.map(tab => (
            <div
              key={tab}
              onClick={() => setTab(tab)}
              className={classNames(
                tab === currentTab && "font-semibold !text-slate-200",
                "cursor-pointer text-slate-400 hover:text-slate-100"
              )}
            >
              {tab}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
