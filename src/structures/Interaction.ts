import { ComponentData, Interaction as RawInteraction, ResponseData, ResponseType, SlashData, SlashDataResolved, SlashOption } from '../types/Interaction'
import { ComponentType } from '../types/MessageComponent'

const BASE = 'https://discord.com/api/v8'

export default class Interaction {

  id: string
  applicationID: string
  #token: string

  guildID?: string
  channelID?: string
  member?: any
  user?: any

  constructor(data: RawInteraction) {
    this.id = data.id
    this.applicationID = data.application_id
    this.#token = data.token
    this.guildID = data.guild_id
    this.channelID = data.channel_id
    this.member = data.member
    this.user = data.user
  }

  respond(type: ResponseType, data?: ResponseData): Promise<Response> {
    return fetch(`${BASE}/interactions/${this.id}/${this.#token}/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    })
  }

  editResponse(data: Omit<ResponseData, 'tts' | 'flags'>): Promise<Response> {
    return fetch(`${BASE}/webhooks/${this.applicationID}/${this.#token}/messages/@original`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  sendImage(image: Blob, data: Omit<ResponseData, 'tts' | 'flags'> = { content: '' }): Promise<Response> {
    const body = new FormData()
    body.append('file', image, 'image.png')
    body.append('payload_json', JSON.stringify(data))

    return fetch(`${BASE}/webhooks/${this.applicationID}/${this.#token}/messages/@original`, {
      body,
      method: 'PATCH',
    })
  }

  deleteResponse(): Promise<Response> {
    return fetch(`${BASE}/webhooks/${this.applicationID}/${this.#token}/messages/@original`, {
      method: 'DELETE',
    })
  }

  followUp(data: ResponseData): Promise<Response> {
    return fetch(`${BASE}/webhooks/${this.applicationID}/${this.#token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  editFollowUp(messageID: string, data: Omit<ResponseData, 'tts' | 'flags'>): Promise<Response> {
    return fetch(`${BASE}/webhooks/${this.applicationID}/${this.#token}/messages/${messageID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  deleteFollowUp(messageID: string): Promise<Response> {
    return fetch(`${BASE}/webhooks/${this.applicationID}/${this.#token}/messages/${messageID}`, {
      method: 'DELETE',
    })
  }

}

export class SlashInteraction extends Interaction {
  commandID: string
  resolved?: SlashDataResolved
  options: SlashOption[]

  constructor(data: RawInteraction<SlashData>) {
    super(data)
    this.commandID = data.data?.id!
    this.resolved = data.data?.resolved
    this.options = data.data?.options ?? []
  }

  getOption<T>(name: string): T | undefined {
    const option = this.options.find(option => option.name === name)
    return (option as SlashOption<T>)?.value
  }

}

export class ComponentInteraction extends Interaction {
  type: ComponentType
  customID: string
  message: any

  constructor(data: RawInteraction<ComponentData>) {
    super(data)
    this.type = data.data?.component_type!
    this.customID = data.data?.custom_id!
    this.message = data.message
  }
}
