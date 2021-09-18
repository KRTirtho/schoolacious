import { format } from "winston";

export const loggerFormat = format.printf(
    ({ level, message, context, ms, label, ...meta }) => {
        if (typeof message === "object") message = JSON.stringify(message ?? "", null, 2);

        const strMeta =
            Object.keys(meta).length === 0 ? "" : JSON.stringify(meta, null, 2);

        const colorize = (m: string) =>
            format
                .colorize({ colors: { info: "cyan bold", error: "red bold" } })
                .colorize(level, m);
        return `[${colorize(label)}] ${colorize(level.toUpperCase())} [${colorize(
            context,
        )}]: ${message} ${strMeta} ${colorize(ms ?? "")}`;
    },
);
