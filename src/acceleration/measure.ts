import { IAcceleration, IRotation } from "../utils/angleUtils";

export interface IMovement extends IAcceleration, IRotation {

}

export interface IMeasureSource {
    value: IMovement;
    start: () => void;
}