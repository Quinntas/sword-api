import {EventEmitter} from "./eventEmitter";

export abstract class Event<T extends string | Record<PropertyKey, any>> {
    protected constructor(
        private readonly _name: string,
        private readonly eventEmitter: EventEmitter
    ) {
    }

    get name() {
        return this._name
    }

    async publish(message: T) {
        await this.eventEmitter.publish(this.name, message)
    }

    abstract handle(message: string | null): void | Promise<void>
}