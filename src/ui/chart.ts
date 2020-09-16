export class Chart {
    private readonly svg: SVGElement;
    private readonly path: SVGPathElement;
    private readonly maxPoints: number;
    private readonly height: number;
    private readonly width: number;
    private readonly pxPerPoint = 4;

    private symbolByIndex(index: number) {
        if (index === 0) {
            return "M";
        }
        if (index === 1) {
            return " L";
        }
        return " ";
    }

    private tail(values: number[], n: number) {
        if (values.length <= n) {
            return values;
        }
        return values.slice(values.length - n);
    }

    constructor(
        private readonly container: HTMLElement
    ) {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.style.width = "100%";
        this.svg.style.height = "100%";
        this.container.appendChild(this.svg);

        this.path = document.createElementNS("http://www.w3.org/2000/svg","path");
        this.path.style.fill = "none";
        this.path.style.strokeWidth = "1px";
        this.path.style.stroke = "red";
        this.svg.appendChild(this.path);

        this.height = container.offsetHeight;
        this.width = container.offsetWidth;

        this.maxPoints = this.width / this.pxPerPoint;
    }

    draw(values: number[]) {
        if (values.length < 2) {
            return;
        }
        values = this.tail(values, this.maxPoints);

        let max = 8; //Math.max.apply(Math, values);
        let min = -8; //Math.min.apply(Math, values);
        let alp = max - min;
        let ratio = this.height / alp;

        let coords = values.map((v, index) => {
            let r = -1 * (min + v) * ratio;
            return `${index * this.pxPerPoint},${r.toFixed(3)}`;
        });
        let d = coords.reduce((akk, c, index) => {
            return akk + this.symbolByIndex(index) + c;
        }, "");
        this.path.setAttributeNS(null, "d", d);
    };

    clear() {
        this.path.setAttributeNS(null, "d", "");
    }
}