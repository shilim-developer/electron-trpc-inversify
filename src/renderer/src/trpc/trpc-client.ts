import type { AppRouter } from '@main/modules/app/app.router'
import { createTRPCClient } from '@trpc/client'
import { ipcLink } from 'trpc-electron/renderer'

export const trpcClient = createTRPCClient<AppRouter>({
  links: [ipcLink()]
})
