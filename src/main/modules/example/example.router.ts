import { inject, injectable } from 'inversify'
import { createRouter, ee, publicProcedure } from '../../trpc/trpc'
import z from 'zod'
import { on } from 'events'
import { zAsyncIterable } from '../../trpc/z-async-iterable'
import { trpcQueryListOutputSchema } from './models/trpc-query-list'
import { trpcMutationListInputSchema } from './models/trpc-mutation-list'
import { subscribeSendInputSchema } from './models/subscribe-send-test'
import ExampleService from './example.service'

export const subscribeTest = Symbol('subscribeTest')

@injectable()
export default class ExampleRouter {
  constructor(@inject(ExampleService) private readonly exampleService: ExampleService) {}
  create() {
    return createRouter({
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
    })
  }
}
