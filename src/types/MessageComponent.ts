export interface MessageComponent {
  type: ComponentType
}

export enum ComponentType {
  ActionRow = 1,
  Button,
  SelectMenu,
}

export interface ActionRow extends MessageComponent {
  type: ComponentType.ActionRow
  components: (Button | SelectMenu)[]
}

export interface Button extends MessageComponent {
  type: ComponentType.Button
  style: ButtonStyle
  label?: string
  emoji?: Partial<PartialEmoji>
  custom_id: string
  url?: string
  disabled?: boolean
}

export enum ButtonStyle {
  Primary = 1,
  Secondary,
  Success,
  Danger,
  Link,
}

export interface PartialEmoji {
  id: string
  name: string
  animated: boolean
}

export interface SelectMenu extends MessageComponent {
  type: ComponentType.SelectMenu
  custom_id: string
  options: SelectOption[]
  placeholder?: string
  min_values?: number
  max_values?: number
  disabled?: boolean
}

export interface SelectOption {
  label: string
  value: string
  description?: string
  emoji?: PartialEmoji
  default?: boolean
}
