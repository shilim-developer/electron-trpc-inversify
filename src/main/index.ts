import AppService from './modules/app/app.service'
import { container } from './modules/di'

container.get<AppService>(AppService).bootstrap()
