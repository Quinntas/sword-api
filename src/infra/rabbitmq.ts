import {Channel, ChannelModel, connect, Options} from 'amqplib';
import {EventEmitter} from "../contracts/eventEmitter";

export class Rabbitmq implements EventEmitter {
    private connection: ChannelModel | null = null;
    private channel: Channel | null = null;

    constructor(private readonly url: string) {
    }

    async connect(): Promise<void> {
        try {
            this.connection = await connect(this.url);
            this.channel = await this.connection.createChannel();
        } catch (error) {
            throw new Error(`Failed to connect to RabbitMQ: ${error}`);
        }
    }

    async createQueue(queue: string): Promise<void> {
        if (!this.channel) {
            throw new Error('Channel not initialized. Call connect() first');
        }

        await this.channel.assertQueue(queue, {
            durable: true,
        });
    }

    async publish<T extends string | Record<PropertyKey, any>>(queue: string, message: T, options?: Options.Publish): Promise<void> {
        if (!this.channel) {
            throw new Error('Channel not initialized. Call connect() first');
        }

        const content = typeof message === 'string'
            ? message
            : JSON.stringify(message);

        this.channel.sendToQueue(queue, Buffer.from(content), options);
    }

    async consume(queue: string, callback: (message: string | null) => Promise<void>): Promise<void> {
        if (!this.channel) {
            throw new Error('Channel not initialized. Call connect() first');
        }

        await this.channel.consume(queue, async (message) => {
            if (!message) return;
            try {
                const content = message.content.toString();
                await callback(content);
                this.channel?.ack(message);
            } catch (error) {
                this.channel?.nack(message);
                throw error;
            }
        });
    }

    async close(): Promise<void> {
        if (this.channel) {
            await this.channel.close();
        }
    }
}