"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Proposal, ProposalMechanism } from "~/dummy/proposals"
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TextField
} from "~/sushi-ui"

type NewProposal = Pick<Proposal, "title" | "description" | "mechanism"> & {
  spaceId: number
}

export default function CreateProposal() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [mechanism, setMechanism] = useState(ProposalMechanism.SINGLE)

  const params = useSearchParams()
  const router = useRouter()

  const { mutate } = useMutation<number, Error, NewProposal>({
    mutationKey: ["createProposal"],
    mutationFn: async ({ title, description, mechanism, spaceId }) => {
      console.log(title, description, mechanism, spaceId)
      return 2
    },
    onSuccess: proposalId => {
      router.push(
        `/space/proposal?spaceId=${params.get("spaceId")}&proposalId=${proposalId}`
      )
    }
  })

  const createProposal = useCallback(() => {
    mutate({
      title,
      description,
      mechanism,
      spaceId: Number(params.get("spaceId"))
    })
  }, [description, mechanism, mutate, params, title])

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-2xl font-semibold">Create Proposal</h1>
        <div className="space-y-4">
          <div className="flex justify-between items-center space-x-8">
            <label htmlFor="title">Title</label>
            <div className="w-2/5">
              <TextField
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter title"
              />
            </div>
          </div>
          <div className="flex justify-between items-center space-x-8">
            <label htmlFor="description">Description</label>
            <div className="w-2/5">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full p-2 border-gray-300 rounded-md bg-secondary border-0"
              />
            </div>
          </div>
          <div className="flex justify-between items-center space-x-8">
            <label htmlFor="mechanism">Mechanism</label>
            <div className="">
              <Select
                value={mechanism}
                onValueChange={value =>
                  setMechanism(value as ProposalMechanism)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProposalMechanism.SINGLE}>
                    Single
                  </SelectItem>
                  <SelectItem value={ProposalMechanism.MULTIPLE}>
                    Multiple
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button variant="outline" className="w-2/5" onClick={createProposal}>
            Create
          </Button>
        </div>
      </div>
    </div>
  )
}
