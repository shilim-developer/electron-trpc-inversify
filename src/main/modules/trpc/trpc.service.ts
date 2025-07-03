import { injectable } from 'inversify'

@injectable()
export default class TrpcService {
  queryTest(params: { text: string }): { text: string } {
    return params
  }
}
