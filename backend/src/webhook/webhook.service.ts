import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  async sendWebhook(event: string, payload: object): Promise<void> {
    this.logger.log(`[${event}] ${JSON.stringify(payload)}`);
  }
}
