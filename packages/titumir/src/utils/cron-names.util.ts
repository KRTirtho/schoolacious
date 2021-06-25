export function classJob(id: string) {
    return `class:${id}`;
}

type CronObj = Partial<{
    second: string | number;
    minute: string | number;
    hour: string | number;
    day: string | number;
    date: string | number;
    month: string | number;
}>;

export function cronFromObj({
    second = "*",
    minute = "*",
    hour = "*",
    date = "*",
    month = "*",
    day = "*",
}: CronObj): string {
    return `${second} ${minute} ${hour} ${date} ${month} ${day}`;
}
