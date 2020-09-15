import { IMeasureSource } from "../index";

export class RandomMeasure implements IMeasureSource {
    get value() {
        return {
            x: Math.random() * 6,
            y: Math.random() * 6,
            z: Math.random() * 6,
            alpha: 0,
            beta: 0,
            gamma: 0
        };
    }

    start() {}
}