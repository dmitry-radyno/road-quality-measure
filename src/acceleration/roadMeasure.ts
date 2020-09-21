import { deg2rad, IAcceleration, IRotation, rotate } from "../utils/angleUtils";
import { IMeasureSource, IMovement } from "../acceleration/measure";

export class RoadMeasure implements IMeasureSource {

    private lastMotion: IAcceleration = { x: 10, y: 0, z: 0};
    private lastOrientation: IRotation = { alpha: 0, beta: 0, gamma: 0 };

    private readonly captureMotion = (e: any) => {
        this.lastMotion = {
            x: e.acceleration.x,
            y: e.acceleration.y,
            z: e.acceleration.z
        };
    };

    private readonly captureRotation = (e: any) => {
        this.lastOrientation = {
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma
        };
    }

    async start() {
        if (!window.DeviceMotionEvent) {
            return;
        }
    
        let permissions = await Promise.all([
            await DeviceMotionEvent.requestPermission(),
            await DeviceOrientationEvent.requestPermission()
        ]);
        if (permissions.some(p => p !== "granted")) {
            alert("Not granted");
            return;
        }

        window.addEventListener("devicemotion", this.captureMotion);
        window.addEventListener("deviceorientation", this.captureRotation);
    }

    stop() {
        window.removeEventListener("devicemotion", this.captureMotion);
        window.removeEventListener("deviceorientation", this.captureRotation);
    }

    get value(): IMovement {
        let v = rotate(
            this.lastMotion,
            deg2rad(this.lastOrientation.alpha),
            deg2rad(this.lastOrientation.beta),
            deg2rad(this.lastOrientation.gamma)
        );
        return { ...v, ...this.lastOrientation };
    }
}