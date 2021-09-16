export function militaryTo12HourTime(timeString: string): string {
    // Append any date. Use your birthday.
    return new Date("1966-05-19T" + timeString + "Z").toLocaleTimeString([], {
        timeZone: "UTC",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
}
