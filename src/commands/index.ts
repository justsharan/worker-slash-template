import { SlashInteraction } from '../structures/Interaction'
import { InteractionResponse } from '../types/Interaction'

type Command = (int: SlashInteraction, wait: (f: any) => void) => InteractionResponse

export default {

} as Record<string, Command>
