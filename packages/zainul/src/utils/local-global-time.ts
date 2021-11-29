import { addMinutes, lightFormat, parse, subMinutes } from "date-fns";

export function localToGlobalTimeString(localTime: string, format = "HH:mm"): string {
    return parse(localTime, format, new Date()).toISOString().split("T")[1].split(".")[0];
}

export function globalToLocalTimeString(globalTime: string): string {
    const date = parse(globalTime, "HH:mm:ss", new Date());
    const offset = date.getTimezoneOffset();
    const converted = offset < 0 ? subMinutes(date, offset) : addMinutes(date, offset);
    return lightFormat(converted, "hh:mm a");
}
