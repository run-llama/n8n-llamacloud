import type { FinalRequestOptions } from "./request-options.js";
import { type LlamaCloud } from "../client.js";
export type APIResponseProps = {
    response: Response;
    options: FinalRequestOptions;
    controller: AbortController;
    requestLogID: string;
    retryOfRequestLogID: string | undefined;
    startTime: number;
};
export declare function defaultParseResponse<T>(client: LlamaCloud, props: APIResponseProps): Promise<T>;
//# sourceMappingURL=parse.d.ts.map