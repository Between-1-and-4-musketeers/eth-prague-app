import Link from "next/link"

export function Header() {
  return (
    <div className="px-4 sticky flex items-center flex-grow gap-4 top-0 z-50 min-h-[56px] max-h-[56px] h-[56px] bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
      <div className="flex items-center justify-between flex-grow gap-4">
        <Link href="/">
          <div className="font-medium">DecGov</div>
        </Link>
      </div>
    </div>
  )
}
