export class CumulativeAvg {
    private avg = 0;
    private n = 0;
    private values: number[] = [];

    add(value: number) {
        this.values.push(value);

        if (this.n === 0) {
            this.avg = value;
            this.n++;
            return;
        }
        this.avg = (value + this.n*this.avg)/(this.n + 1);
        this.n++;
    }

    get value() {
        return this.avg;
    }

    get dispersion() {
        return this.values.reduce((sum, v) => sum + Math.pow((v - this.avg), 2), 0) / this.n;
    }
}