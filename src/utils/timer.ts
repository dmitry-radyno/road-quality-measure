export function timer(timeout: number) {
    return new Promise((res) => {
        setTimeout(res, timeout);
    });
}