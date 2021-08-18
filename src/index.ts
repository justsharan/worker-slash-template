import { SlashInteraction, ComponentInteraction } from './structures/Interaction'
import { Interaction, InteractionType, SlashData, ComponentData } from './types/Interaction'
import verify from './verify'
import commands from './commands/'
import componentActions from './components/'

declare global {
  const PUBLIC_KEY: string
}

addEventListener('fetch', (event) => {
  event.respondWith(handle(event.request, event.waitUntil.bind(event)))
})

async function handle(request: Request, wait: (f: any) => void): Promise<Response> {
  // Request data
  const body = await request.text()
  const signature = request.headers.get('X-Signature-Ed25519') ?? ''
  const timestamp = request.headers.get('X-Signature-Timestamp') ?? ''

  // Verify signature
  if (!verify(body, signature, timestamp, PUBLIC_KEY)) {
    return new Response('Bad signature', { status: 401 })
  }

  // Parse and handle payload properly
  const payload: Interaction = JSON.parse(body)
  switch (payload.type) {
    case InteractionType.Ping:
      return new Response(JSON.stringify({ type: 1 }))
    case InteractionType.ApplicationCommand:
      /* eslint-disable-next-line no-case-declarations */
      const incomingCommand = payload as Interaction<SlashData>
      for (const [name, command] of Object.entries(commands)) {
        if (name === incomingCommand.data?.name) {
          const reply = await command(new SlashInteraction(incomingCommand), wait)
          return new Response(JSON.stringify(reply), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }
      }
    break
  case InteractionType.MessageComponent:
    /* eslint-disable-next-line no-case-declarations */
    const incomingComponent = payload as Interaction<ComponentData>
    for (const [name, componentAction] of Object.entries(componentActions))  {
      if (name === incomingComponent.message.interaction.name) {
        const reply = await componentAction(new ComponentInteraction(incomingComponent), wait)
        return new Response(JSON.stringify(reply), {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
    }
    break
  }

  return new Response('Unrecognized type', { status: 400 })

}
