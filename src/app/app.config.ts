import { Injectable } from '@angular/core';
import { ConfigService } from './services/config.service';

@Injectable()
export class AppConfig {

    constructor(protected configService: ConfigService) { }

    public load():Promise<any> {
        return this.configService.doReadExternalConfig();
    }
}
