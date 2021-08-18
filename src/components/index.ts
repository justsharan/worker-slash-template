import { ComponentInteraction } from '../structures/Interaction'
import { InteractionResponse } from '../types/Interaction'

type ComponentAction = (int: ComponentInteraction, wait: (f: any) => void) => InteractionResponse

export default {

} as Record<string, ComponentAction>
