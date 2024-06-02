import { z } from "zod"

export enum EventType {
  ON_PROPOSAL_CREATED = "ON_PROPOSAL_CREATED",
  ON_PROPOSAL_ENDED = "ON_PROPOSAL_ENDED",
  ON_VOTE = "ON_VOTE"
}

export type Event = {
  id: number
  eventType: EventType
  webhookUrl: string
  payload: string
  spaceId: number
}

export const eventSchema = z
  .object({
    id: z.number(),
    eventtype: z.number().transform(x => {
      if (x === 0) return EventType.ON_PROPOSAL_CREATED
      if (x === 1) return EventType.ON_PROPOSAL_ENDED
      if (x === 2) return EventType.ON_VOTE
      return EventType.ON_PROPOSAL_CREATED
    }),
    spaceId: z.number(),
    webhookUrl: z.string(),
    payload: z.string()
  })
  .transform(event => ({
    ...event,
    eventType: event.eventtype
  }))

export const dummyEvents: Event[] = [
  {
    id: 0,
    eventType: EventType.ON_PROPOSAL_CREATED,
    webhookUrl: "http://localhost:3000",
    payload: "proposal created",
    spaceId: 0
  },
  {
    id: 1,
    eventType: EventType.ON_PROPOSAL_ENDED,
    webhookUrl: "http://localhost:3000",
    payload: "proposal ended",
    spaceId: 0
  },
  {
    id: 2,
    eventType: EventType.ON_VOTE,
    webhookUrl: "http://localhost:3000",
    payload: `{
      "content": "asjdashuidasoihdasuioijawd",
      "embeds": [
        {
          "title": "What's this about?",
          "description": "Discoho \${link} is a free tool that allows you to personalise your server to make your server stand out from the crowd. The main way it does this is using [webhooks](https://support.discord.com/hc/en-us/articles/228383668), which allows services like Discohook to send any messages with embeds to your server.\n\nTo get started with sending messages, you need a webhook URL, you can get one via the \"Integrations\" tab in your server's settings. If you're having issues creating a webhook, [the bot](https://discohook.app/bot) can help you create one for you.\n\nKeep in mind that Discohook can't do automation yet, it only sends messages when you tell it to. If you are looking for an automatic feed or custom commands this isn't the right tool for you.",
          "color": 5814783
        },
        {
          "title": "Discord bot",
          "description": "Discohook has a bot as well, it's not strictly required to send messages it may be helpful to have it ready.\n\nBelow is a small but incomplete overview of what the bot can do for you.",
          "color": 5814783,
          "fields": [
            {
              "name": "Getting special formatting for mentions, channels, and emoji",
              "value": "The **/format** command of the bot can give you special formatting for use in Discord messages that lets you create mentions, tag channels, or use emoji ready to paste into the editor!\n\nThere are [manual ways](https://discord.dev/reference#message-formatting) of doing this, but it's very error prone. The bot will make sure you'll always get the right formatting for your needs."
            },
            {
              "name": "Creating reaction roles",
              "value": "You can manage reaction roles with the bot using the **/reaction-role** command.\n\nThe set-up process is very intuitive: type out **/reaction-role create**, paste a message link, select an emoji, and pick a role. Hit enter and you're done, your members can now react to any of your messages to pick their roles."
            },
            {
              "name": "Recover Discohook messages from your server",
              "value": "It can also restore any message sent in your Discord server for you via the apps menu.\n\nTo get started, right-click or long-press on any message in your server, press on apps, and then press **Restore to Discohook**. It'll send you a link that leads to the editor page containing the message you selected!"
            },
            {
              "name": "Other features",
              "value": "Discohook can also grab images from profile pictures or emoji, manage your webhooks, and more. Invite the bot and use **/help** to learn about all the bot offers!"
            }
          ]
        }
      ],
      "attachments": []
    }`,
    spaceId: 0
  }
]
