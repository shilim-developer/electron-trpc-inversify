import { inject, injectable } from 'inversify'
import { mergeRouters } from '../../trpc/trpc'
import WindowRouter from '../window/window.router'
import TrpcRouter from '../example/example.router'

@injectable()
export default class AppRouterFactory {
  constructor(
    @inject(WindowRouter) private windowRouter: WindowRouter,
    @inject(TrpcRouter) private trpcRouter: TrpcRouter
  ) {}

  create() {
    return mergeRouters(this.windowRouter.create(), this.trpcRouter.create())
  }
}

export type AppRouter = ReturnType<AppRouterFactory['create']>
