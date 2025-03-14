import {Rabbitmq} from "../infra/rabbitmq";

export const eventEmitter = new Rabbitmq(process.env.RABBITMQ_URL!);