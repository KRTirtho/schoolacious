import { lightFormat, parseISO } from "date-fns";

export function localDateToDayTime(date: Date) {
    const universalDate = parseISO(date.toISOString());
    const time = lightFormat(universalDate, "HH:mm:ss");
    const day = universalDate.getDay();
    return { time, day };
}
