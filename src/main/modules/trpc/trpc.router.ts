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
        trpcQueryList: publicProcedure
          .output(
            z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                value: z.string()
              })
            )
          )
          .query(() => {
            try {
              return this.trpcService.trpcQueryList()
            } catch (error) {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                cause: error
              })
            }
          }),
        trpcMutationList: publicProcedure
          .input(
            z.object({
              id: z.number(),
              name: z.string()
            })
          )
          .output(z.boolean())
          .mutation(({ input }) => {
            try {
              return this.trpcService.trpcMutationList(input)
            } catch (error) {
              console.log('error:', error)
              return false
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
          }),
        subscribeSendTest: publicProcedure
          .input(
            z.object({
              id: z.number(),
              value: z.string()
            })
          )
          .mutation(({ input }) => {
            this.trpcService.trpcSubscribeSend(input)
            ee.emit('subscribeTest', input)
          })
      }
    })
  }
}
