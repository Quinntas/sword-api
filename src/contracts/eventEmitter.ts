export abstract class EventEmitter {
    abstract publish<T extends string | Record<PropertyKey, any>>(queue: string, message: T): Promise<void>
}