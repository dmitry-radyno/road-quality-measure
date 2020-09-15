export const formatNumber = (v: number) => {
    let r = v.toFixed(1);
    if (r.indexOf("-") === 0) {
        return r;
    }
    return "+" + r;
};