import { ColumnDef } from "@tanstack/react-table"
import { ProposalOptionVote } from "~/dummy/votes"
import { Card } from "~/sushi-ui"
import { DataTable } from "~/sushi-ui/components/data-table/index"
import numeral from "numbro"

const COLUMNS: ColumnDef<ProposalOptionVote, unknown>[] = [
  { id: "voter", header: "Voter", cell: ({ row }) => row.original.address },
  {
    id: "option",
    header: "Option",
    cell: ({ row }) => row.original.optionId
  },
  {
    id: "power",
    header: "Voting Power",
    cell: ({ row }) => numeral(Number(row.original.power)).format("0.00a")
  }
]

export function Votes({ optionVotes }: { optionVotes: ProposalOptionVote[] }) {
  const sorted = optionVotes.sort((a, b) => (a.power > b.power ? -1 : 1))

  return (
    <div className="space-y-4">
      <h2 className="text-lg">Votes</h2>
      <Card>
        <DataTable data={sorted} columns={COLUMNS} loading={false} />
      </Card>
    </div>
  )
}
