export class TitumirError extends TypeError {
    status: number;
    body: Record<string | number, unknown>;
    moduleName: string;

    constructor({
        statusText,
        url,
        status,
        body,
        moduleName,
    }: {
        url: string;
        statusText: string;
        status: number;
        body: Record<string | number, unknown>;
        moduleName: string;
    }) {
        super();
        this.body = body;
        this.stack = `[TitumirError in ${moduleName.toUpperCase()} - "${statusText}"]: the following ${url} returned status ${status} \n [Response]: ${JSON.stringify(
            this.body,
            null,
            2,
        )}`;
        this.status = status;
        this.moduleName = moduleName;
    }
}
