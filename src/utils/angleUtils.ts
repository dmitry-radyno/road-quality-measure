export interface IAcceleration {
    x: number | null;
    y: number | null;
    z: number | null;
}

export interface IRotation {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
}

export const roundAngle = (value: number) => {
    if (value > 360) {
        return value - 360;
    }
    if (value < -360) {
        return value + 360;
    }
    return value;
};

export const deg2rad = (value: number) => {
    return roundAngle(value) / 180 * Math.PI;
};

export const sin = Math.sin;
export const cos = Math.cos;

export const rotate = (vector: IAcceleration, a: number, b: number, g: number) => {
    let x = vector.x * (cos(a)*cos(g))                          + vector.y * (sin(a)*cos(g))                        + vector.z * (-1*sin(g));
    let y = vector.x * (cos(a)*sin(b)*sin(g) - sin(a)*cos(b))   + vector.y * (sin(a)*sin(b)*sin(g) + cos(a)*cos(b)) + vector.z * (sin(b)*cos(g));
    let z = vector.x * (cos(a)*cos(b)*sin(g) - sin(a)*sin(b))   + vector.y * (sin(a)*cos(b)*sin(g) - cos(a)*sin(b)) + vector.z * (cos(b)*cos(g));
    return { x, y, z };
};

export const rx = (vector: IAcceleration, angle: number) => {
    let x = vector.x * 1 + vector.y * 0                 + vector.z * 0;
    let y = vector.x * 0 + vector.y * Math.cos(angle)   - vector.z * Math.sin(angle);
    let z = vector.x * 0 + vector.y * Math.sin(angle)   + vector.z * Math.cos(angle);
    return { x, y, z };
};

export const ry = (vector: IAcceleration, angle: number) => {
    let x =  vector.x * Math.cos(angle) + vector.y * 0 + vector.z * Math.sin(angle);
    let y =  vector.x * 0               + vector.y * 1 - vector.z * 0;
    let z = -vector.x * Math.sin(angle) + vector.y * 0 + vector.z * Math.cos(angle);
    return { x, y, z };
};

export const rz = (vector: IAcceleration, angle: number) => {
    let x = vector.x * Math.cos(angle)  - vector.y * Math.sin(angle)    + vector.z * 0;
    let y = vector.x * Math.sin(angle)  + vector.y * Math.cos(angle)    + vector.z * 0;
    let z = vector.x * 0                + vector.y * 0                  + vector.z * 1;
    return { x, y, z };
};