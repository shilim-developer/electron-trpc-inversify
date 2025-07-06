import { injectable } from 'inversify'
import { ListItemDto } from './models/list-item.dto'

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

  trpcMutationList(input: Omit<ListItemDto, 'value'>): boolean {
    const index = this.list.findIndex((item) => item.id === input.id)
    this.list[index].name = input.name
    return true
  }

  trpcSubscribeSend(input: Omit<ListItemDto, 'name'>): boolean {
    const index = this.list.findIndex((item) => item.id === input.id)
    this.list[index].value = input.value
    return true
  }
}
