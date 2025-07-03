import { Container } from 'inversify'
import { windowModule } from './window/window.module'
import { appModule } from './app/app.module'
import { trpcModule } from './trpc/trpc.module'

const modules = [appModule, windowModule, trpcModule]
const container = new Container()
container.loadSync(...modules)

export { container }
