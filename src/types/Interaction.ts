import { AllowedMentions, Embed, GuildMember, PartialChannel, Role, User } from './Discord'
import { ActionRow, ComponentType } from './MessageComponent'

export type SlashInteraction = Interaction<SlashData>
export type WaitFunction = (f: any) => void

export interface Interaction<T = unknown> {
  id: string
  application_id: string
  type: InteractionType
  data?: T
  guild_id?: string
  channel_id?: string
  member?: GuildMember
  user?: User
  token: string
  version: number
  message?: any
}

export enum InteractionType {
  Ping = 1,
  ApplicationCommand,
  MessageComponent,
}

export interface SlashData {
  id: string
  name: string
  resolved?: SlashDataResolved
  options?: SlashOption[]
}

export interface SlashDataResolved {
  users?: Record<string, User>
  members?: Record<string, Omit<GuildMember, 'user' | 'deaf' | 'mute'>>
  roles?: Record<string, Role>
  channels?: Record<string, PartialChannel>
}

export interface SlashOption<T = unknown> {
  name: string
  type: OptionType
  value?: T
  options?: SlashOption[]
}

export enum OptionType {
  Subcommand = 1,
  SubcommandGroup,
  String,
  Integer,
  Boolean,
  User,
  Channel,
  Role,
  Mentionable,
  Number,
}

export interface ComponentData {
  custom_id: string
  component_type: ComponentType
}

export interface InteractionResponse {
  type: ResponseType
  data?: ResponseData
}

export enum ResponseType {
  Pong = 1,
  ChannelMessageWithSource = 4,
  DeferredChannelMessageWithSource,
  DeferredUpdateMessage,
  UpdateMessage,
}

export interface ResponseData {
  tts?: boolean
  content: string
  embeds?: Embed[]
  allowed_mentions?: AllowedMentions
  flags?: number
  components?: ActionRow[]
}

export enum ResponseFlags {
  Ephemeral = 1 << 6,
}
