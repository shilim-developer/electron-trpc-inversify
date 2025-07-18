import { inject, injectable } from 'inversify'
import { createRouter, ee, publicProcedure } from '../../trpc/trpc'
import z from 'zod'
import { on } from 'events'
import { zAsyncIterable } from '../../trpc/z-async-iterable'
import { trpcQueryListOutputSchema } from './models/trpc-query-list'
import { trpcMutationListInputSchema } from './models/trpc-mutation-list'
import { subscribeSendInputSchema } from './models/subscribe-send-test'
import ExampleService from './example.service'
import type { AnyProcedure } from '@trpc/server'
import { pick } from 'es-toolkit/compat'

export const subscribeTest = Symbol('subscribeTest')

type Pathify<T, P extends string = ''> = T extends AnyProcedure // 如果 T 是一个对象
  ? P
  : {
      [K in keyof T]: Pathify<T[K], `${P}` extends '' ? `${P}${K & string}` : `${P}.${K & string}`>
    }[keyof T]

type NestedPick<T, K extends string> = K extends keyof T
  ? Pick<T, K>
  : K extends `${infer Head}.${infer Tail}`
    ? Head extends keyof T
      ? { [P in Head]: NestedPick<T[Head], Tail> }
      : never
    : never

type _PickPaths<T, U extends string> = (
  U extends any ? (U extends `${infer K}.${any}` ? K : U) : never
) extends infer Keys
  ? Keys extends never
    ? {}
    : {
        [K in Keys & string]: K extends keyof T
          ? Extract<U, K> extends never
            ? _PickPaths<
                T[K],
                Extract<U, `${K}.${any}`> extends `${K}.${infer Rest}` ? Rest : never
              >
            : T[K]
          : never
      }
  : never

type PickByPaths<T, K extends Pathify<T>[]> = NestedPick<T, K[number]>
type ArrayToIntersection<T, K extends Pathify<T>[]> = K extends Pathify<T>[]
  ? First extends Pathify<T>
    ? Rest extends Pathify<T>[]
      ? NestedPick<T, First> & ArrayToIntersection<T, Rest>
      : NestedPick<T, First>
    : never
  : boolean

// 工具类型：把路径拆分成第一个key和剩余部分
type SplitPath<Path extends string> = Path extends `${infer Head}.${infer Rest}`
  ? [Head, Rest]
  : [Path, never]

// 递归挑选类型
type DeepPick<T, K extends string> =
  // 先通过联合类型拆分多个路径
  K extends unknown ? _DeepPick<T, SplitPath<K>> : never

// 处理单一路径
type _DeepPick<T, Path extends [string, string | never]> = Path[1] extends never
  ? { [P in Path[0] & keyof T]: T[P] } // 最后一级，直接挑选字段
  : Path[0] extends keyof T
    ? {
        [P in Path[0] & keyof T]: DeepPick<T[P], Path[1] & string> // 递归挑选
      }
    : {} // 不存在key，空对象

// 多路径合并，用交叉类型合并
type MergeObjects<T> = {
  [K in keyof T]: T[K]
}

// 将多个路径的结果合并为一个类型
type DeepPickMerge<T, K extends Pathify<T>> = UnionToIntersection<DeepPick<T, K>>

// Union 转 Intersection
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

type getArrayType<T> = T extends Array<infer U> ? U : never

@injectable()
export default class ExampleRouter {
  constructor(@inject(ExampleService) private readonly exampleService: ExampleService) {}

  _router() {
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

  create<T extends Pathify<ReturnType<typeof this._router>>>(filters: T[]) {
    // const a = {
    //   trpc: {
    //     trpcQueryList: publicProcedure
    //       .output(trpcQueryListOutputSchema)
    //       .query(() => this.exampleService.trpcQueryList()),
    //     trpcMutationList: publicProcedure
    //       .input(trpcMutationListInputSchema)
    //       .output(z.boolean())
    //       .mutation(({ input }) => this.exampleService.trpcMutationList(input)),
    //     subscribeTest: publicProcedure
    //       .output(
    //         zAsyncIterable({
    //           yield: z.object({
    //             text: z.string()
    //           })
    //         })
    //       )
    //       .subscription(async function* (opts) {
    //         for await (const [data] of on(ee, subscribeTest, {
    //           signal: opts.signal
    //         })) {
    //           yield data
    //         }
    //       }),
    //     subscribeSendTest: publicProcedure.input(subscribeSendInputSchema).mutation(({ input }) => {
    //       return this.exampleService.trpcSubscribeSend(input)
    //     })
    //   }
    // }
    // type hllo = Pathify<typeof a>
    return '' as NestedPick<ReturnType<typeof this._router>, T>
    // const t : UnionToIntersection<NestedPick<ReturnType<typeof this._router>, T>>
    // const b: DeepPickMerge<ReturnType<typeof this._router>, T>
    // return createRouter(
    //   pick(this._router(), filters) as DeepPickMerge<
    //     ReturnType<typeof this._router>,
    //     getArrayType<typeof filters>
    //   >
    // )
  }
}

// const obj = { a:{b:c},d:{e:f},h:{i:j} }

// type hllo = DeepPick<typeof obj, 'a.b' | 'd.e'>

// function pick<T>(filters:T[])

// expect hllo = { a:{b:Function},d:{e:Function} }
// expect T  =  'a.b' | 'd.e'

// Implement DeepPick
// Implement T

// type a = 'a.b' | 'd.e'
