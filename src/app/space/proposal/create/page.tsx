"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { ExecuteOption, ProposalOption } from "~/dummy/options"
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

  const [optionName, setOptionName] = useState("")
  const [optionChainId, setOptionChainId] = useState("")
  const [optionContract, setOptionContract] = useState("")
  const [optionBytecode, setOptionBytecode] = useState("")
  const [options, setOptions] = useState<Omit<ProposalOption, "id">[]>([])

  const params = useSearchParams()
  const router = useRouter()

  const { mutateAsync: mutateProposal } = useMutation<
    number,
    Error,
    NewProposal
  >({
    mutationKey: ["createProposal"],
    mutationFn: async ({ title, description, mechanism, spaceId }) => {
      const url = process.env.NEXT_PUBLIC_BACKEND_API + "/api/proposal"

      const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          title,
          description,
          mechanism: mechanism === ProposalMechanism.SINGLE ? 0 : 1,
          spaceId
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      return Number((await res.json()).proposalId)
    }
  })

  const { mutateAsync: mutateOptions } = useMutation<
    boolean,
    Error,
    Omit<ExecuteOption, "id">[]
  >({
    mutationKey: ["createOption"],
    mutationFn: async options => {
      const url = process.env.NEXT_PUBLIC_BACKEND_API + "/api/option"

      const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(options),
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res.ok
    }
  })

  const createProposal = useCallback(async () => {
    const proposalId = await mutateProposal({
      title,
      description,
      mechanism,
      spaceId: Number(params.get("spaceId"))
    })

    await Promise.all(
      options.map(option =>
        mutateOptions([
          {
            ...(option as ExecuteOption),
            proposalId
          }
        ])
      )
    )

    router.push(`/space?spaceId=${params.get("spaceId")}`)
  }, [
    description,
    mechanism,
    mutateOptions,
    mutateProposal,
    options,
    params,
    router,
    title
  ])

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
          <div className="flex justify-between items-center space-x-8">
            <label htmlFor="description">Options</label>
            <div className="flex-col flex space-y-3">
              <div className="flex justify-between items-center space-x-4">
                <div>Choice</div>
                <div className="w-[280px]">
                  <TextField
                    type="text"
                    value={optionName}
                    onChange={e => setOptionName(e.target.value)}
                    placeholder="Choice"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center space-x-4">
                <div>ChainId</div>
                <div className="w-[280px]">
                  <TextField
                    type="text"
                    value={optionChainId}
                    onChange={e => setOptionChainId(e.target.value)}
                    placeholder="(ChainId)"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center space-x-4">
                <div>Contract</div>
                <div className="w-[380px]">
                  <TextField
                    type="text"
                    value={optionContract}
                    onChange={e => setOptionContract(e.target.value)}
                    placeholder="(Contract)"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center space-x-4">
                <div>Bytecode</div>
                <div className="w-[380px]">
                  <TextField
                    type="text"
                    value={optionBytecode}
                    onChange={e => setOptionBytecode(e.target.value)}
                    placeholder="(Bytecode)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full">
            <Button
              variant="outline"
              className="px-8"
              onClick={() => {
                setOptions([
                  ...options,
                  {
                    name: optionName,
                    onWinChainId: optionChainId
                      ? Number(optionChainId)
                      : undefined,
                    onWinContractAddress: optionContract || undefined,
                    onWinByteCode: optionBytecode || undefined
                  } as ExecuteOption
                ])
                setOptionName("")
                setOptionChainId("")
                setOptionContract("")
                setOptionBytecode("")
              }}
            >
              Add
            </Button>
          </div>
          <div className="">
            Options: {options.map(option => option.name).join(", ")}
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
