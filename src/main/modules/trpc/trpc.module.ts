import { ContainerModule, ContainerModuleLoadOptions } from 'inversify'
import TrpcService from './trpc.service'
import TrpcRouter from './trpc.router'

export const trpcModule: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<TrpcService>(TrpcService).toSelf().inSingletonScope()
    options.bind<TrpcRouter>(TrpcRouter).toSelf().inSingletonScope()
  }
)
