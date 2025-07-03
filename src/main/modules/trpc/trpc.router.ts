import { inject, injectable } from 'inversify'
import { createRouter, ee, publicProcedure } from '../../trpc/trpc'
import z from 'zod'
import { TRPCError } from '@trpc/server'
import TrpcService from './trpc.service'
import { on } from 'events'
import { zAsyncIterable } from '../../trpc/z-async-iterable'
@injectable()
export default class TrpcRouter {
  constructor(@inject(TrpcService) private readonly trpcService: TrpcService) {}
  create() {
    return createRouter({
      trpc: {
        queryTest: publicProcedure
          .input(
            z.object({
              text: z.string()
            })
          )
          .query(({ input }) => {
            try {
              ee.emit('subscribeTest', input)
              return this.trpcService.queryTest(input)
            } catch (error) {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                cause: error
              })
            }
          }),
        subscribeTest: publicProcedure
          .output(
            zAsyncIterable({
              yield: z.object({
                text: z.string()
              })
            })
          )
          .subscription(async function* (opts) {
            for await (const [data] of on(ee, 'subscribeTest', {
              signal: opts.signal
            })) {
              yield data
            }
          })
      }
    })
  }
}
