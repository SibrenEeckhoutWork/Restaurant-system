export declare class WebhookService {
    private readonly logger;
    sendWebhook(event: string, payload: object): Promise<void>;
}
