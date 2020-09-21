interface IDataPoint {
    datetime: number;
    value: number;
}

export type TRoadType = "asphalt" | "tile-square" | "tile-short" | "tile-long" | "other" | "tile-square-rough" | "tile-square-smooth";

interface IMeasurement {
    type: TRoadType;
    description: string;
    data: IDataPoint[];
}

export class DataStore {

    async addItem(item: IMeasurement) {
        return fetch("./api/measurement", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
          })
        .then(response => response.json());
    }

    async getItems(): Promise<string[]> {
        return fetch("./api/measurement")
            .then(response => response.json());
    }

    async getItem(fileName: string): Promise<IMeasurement> {
        return fetch(`./api/measurement/${fileName}`)
            .then(response => response.json());
    }
}