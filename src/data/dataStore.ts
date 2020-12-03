interface IDataPoint {
    datetime: number;
    value: number;
}

export type TRoadType = "asphalt" | "tile-square" | "tile-short" | "tile-long" | "other" | "tile-square-rough" | "tile-square-smooth";


interface IMeasurementMeta {
    type: TRoadType;
    description: string;
}

export interface IMeasurementMetaId extends IMeasurementMeta {
    id: string;
}

interface IMeasurement extends IMeasurementMeta {
    data: IDataPoint[];
}

interface IMeasurementId extends IMeasurementMetaId {
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

    async getItems(): Promise<IMeasurementMetaId[]> {
        return fetch("./api/measurement")
            .then(response => response.json());
    }

    async getItem(fileName: string): Promise<IMeasurementId> {
        return fetch(`./api/measurement/${fileName}`)
            .then(response => response.json());
    }
}