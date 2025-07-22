import { pick } from 'es-toolkit'
import { createRouter } from './trpc'
import type { RouterFilterTypes, PickMultiplePaths } from './trpc-types'

export class TrpcRouter {
  _router() {
    return {}
  }

  all() {
    return createRouter(this._router())
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter<T extends RouterFilterTypes<typeof this._router>[]>(filters: T = [] as any) {
    return createRouter(
      pick(this._router(), filters) as PickMultiplePaths<
        ReturnType<typeof this._router>,
        typeof filters
      >
    )
  }
}
