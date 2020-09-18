interface IDataPoint {
    datetime: number;
    value: number;
}

interface IMeasurement {
    type: string;
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
        .then(response => response.json())
        .then(data => console.log(data));
    }

}