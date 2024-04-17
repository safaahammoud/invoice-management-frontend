type CallbackArgs<T extends (...args: T[]) => T> = Parameters<T>;

export default <T extends (...args: any[]) => any>(
    cb: T,
    delay = 1000
): ((...args: CallbackArgs<T>) => void) => {
    let timer: number = 0;

    return (...args: CallbackArgs<T>) => {
        if (timer) {
            clearTimeout(timer);
        };

        timer = window.setTimeout(() => {
            cb(...args);
        }, delay);
    };
};