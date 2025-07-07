import { injectable } from 'inversify'
import { ListItemDto } from './models/list-item.dto'
import { TrpcMutationListInputType } from './models/trpc-mutation-list'
import { SubscribeSendInputType } from './models/subscribe-send-test'

@injectable()
export default class TrpcService {
  list = [
    {
      id: 1,
      name: 'hello',
      value: 'word'
    }
  ]
  trpcQueryList(): ListItemDto[] {
    return this.list
  }

  trpcMutationList(input: TrpcMutationListInputType): boolean {
    const index = this.list.findIndex((item) => item.id === input.id)
    this.list[index].name = input.name
    return true
  }

  trpcSubscribeSend(input: SubscribeSendInputType): boolean {
    const index = this.list.findIndex((item) => item.id === input.id)
    this.list[index].value = input.value
    return true
  }
}
