"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Event, EventType } from "~/dummy/events"
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TextField
} from "~/sushi-ui"

type NewEvent = Pick<Event, "webhookUrl" | "payload" | "eventType"> & {
  spaceId: number
}

export default function CreateEvent() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [payload, setPayload] = useState("")
  const [eventType, setEventType] = useState(EventType.ON_PROPOSAL_CREATED)

  const params = useSearchParams()
  const router = useRouter()

  const { mutate } = useMutation<void, Error, NewEvent>({
    mutationKey: ["createEvent"],
    mutationFn: async ({ webhookUrl, payload, eventType, spaceId }) => {
      const url = process.env.NEXT_PUBLIC_BACKEND_API + "/api/event"

      await fetch(url, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          webhookUrl,
          payload,
          eventType: Object.keys(EventType).indexOf(eventType),
          spaceId
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
    },
    onSuccess: () => {
      router.push(`/space?spaceId=${params.get("spaceId")}`)
    }
  })

  const createProposal = useCallback(() => {
    mutate({
      webhookUrl,
      payload,
      eventType,
      spaceId: Number(params.get("spaceId"))
    })
  }, [payload, eventType, mutate, params, webhookUrl])

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-2xl font-semibold">Create Event</h1>
        <div className="space-y-4">
          <div className="flex justify-between items-center space-x-8">
            <label htmlFor="webhookUrl">Webhook</label>
            <div className="w-2/5">
              <TextField
                type="text"
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                placeholder="Enter the webhook url"
              />
            </div>
          </div>
          <div className="flex justify-between items-center space-x-8">
            <label htmlFor="payload">Payload</label>
            <div className="w-2/5">
              <textarea
                value={payload}
                onChange={e => setPayload(e.target.value)}
                placeholder="Enter payload"
                className="w-full p-2 border-gray-300 rounded-md bg-secondary border-0"
              />
            </div>
          </div>
          <div className="flex justify-between items-center space-x-8">
            <label htmlFor="eventType">eventType</label>
            <div className="">
              <Select
                value={eventType}
                onValueChange={value => setEventType(value as EventType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EventType.ON_PROPOSAL_CREATED}>
                    On Proposal Created
                  </SelectItem>
                  <SelectItem value={EventType.ON_PROPOSAL_ENDED}>
                    On Proposal Ended
                  </SelectItem>
                  <SelectItem value={EventType.ON_VOTE}>On Vote</SelectItem>
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
