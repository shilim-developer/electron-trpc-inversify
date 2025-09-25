import { inject, injectable } from 'inversify'
import { mergeRouters } from '../trpc/trpc'
import WindowRouter from './window/window.router'
import ExampleRouter from './example/example.router'

@injectable()
export default class AppRouterFactory {
  constructor(
    @inject(WindowRouter) private windowRouter: WindowRouter,
    @inject(ExampleRouter) private exampleRouter: ExampleRouter
  ) {}

  create() {
    return mergeRouters(this.windowRouter.allRouter(), this.exampleRouter.allRouter())
  }
}

export type AppRouter = ReturnType<AppRouterFactory['create']>
