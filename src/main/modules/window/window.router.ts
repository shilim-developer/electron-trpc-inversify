import { injectable } from 'inversify'
import { createRouter, publicProcedure } from '../../trpc/trpc'
import z from 'zod'
import { TRPCError } from '@trpc/server'

@injectable()
export default class WindowRouter {
  getRouter() {
    return {
      window: {
        hello: publicProcedure
          .input(
            z.object({
              name: z.string().optional()
            })
          )
          .query(({ input }) => {
            try {
              const { name } = input
              return name
            } catch (error) {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                cause: error
              })
            }
          })
      }
    }
  }

  create() {
    return createRouter({
      window: {
        hello: publicProcedure
          .input(
            z.object({
              name: z.string().optional()
            })
          )
          .query(({ input }) => {
            try {
              const { name } = input
              return name
            } catch (error) {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                cause: error
              })
            }
          })
      }
    })
  }
}
