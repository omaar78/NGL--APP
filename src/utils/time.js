export function toMs(time, unit) {
    switch (unit) {
        case "second":
            return time * 1000;
        case "minute":
            return time * 60 * 1000;
        case "hour":
            return time * 60 * 60 * 1000;
        default:
            return time;
    }
}

export function toSeconds(time, unit) {
    switch (unit) {
        case "milliSeconds":
            return time / 1000;
        case "minute":
            return time * 60;
        case "hour":
            return time * 60 * 60;
        default:
            return time;
    }

}
