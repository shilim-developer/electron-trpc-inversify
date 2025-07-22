import { inject, injectable } from 'inversify'
import z from 'zod'
import { on } from 'events'
import { zAsyncIterable } from '../../trpc/z-async-iterable'
import { trpcQueryListOutputSchema } from './models/trpc-query-list'
import { trpcMutationListInputSchema } from './models/trpc-mutation-list'
import { subscribeSendInputSchema } from './models/subscribe-send-test'
import ExampleService from './example.service'
import { pick } from 'es-toolkit/compat'
import type { PickMultiplePaths, RouterFilterTypes } from '../../trpc/trpc-types'
import TrpcService from '../trpc/trpc.service'

export const subscribeTest = Symbol('subscribeTest')
@injectable()
export default class ExampleRouter {
  constructor(
    @inject(TrpcService) private readonly trpcService: TrpcService,
    @inject(ExampleService) private readonly exampleService: ExampleService
  ) {}

  private _router() {
    const { publicProcedure, ee } = this.trpcService
    return {
      trpc: {
        trpcQueryList: publicProcedure
          .output(trpcQueryListOutputSchema)
          .query(() => this.exampleService.trpcQueryList()),
        trpcMutationList: publicProcedure
          .input(trpcMutationListInputSchema)
          .output(z.boolean())
          .mutation(({ input }) => this.exampleService.trpcMutationList(input)),
        subscribeTest: publicProcedure
          .output(
            zAsyncIterable({
              yield: z.object({
                text: z.string()
              })
            })
          )
          .subscription(async function* (opts) {
            for await (const [data] of on(ee, subscribeTest, {
              signal: opts.signal
            })) {
              yield data
            }
          }),
        subscribeSendTest: publicProcedure.input(subscribeSendInputSchema).mutation(({ input }) => {
          return this.exampleService.trpcSubscribeSend(input)
        })
      }
    }
  }

  allRouter() {
    const { createRouter } = this.trpcService
    return createRouter(this._router())
  }

  filterRouter<T extends RouterFilterTypes<typeof this._router>[]>(filters: T) {
    const { createRouter } = this.trpcService
    return createRouter(
      pick(this._router(), filters) as PickMultiplePaths<
        ReturnType<typeof this._router>,
        typeof filters
      >
    )
  }
}
