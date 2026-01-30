import type { FinalRequestOptions } from "./request-options.mjs";
import { type LlamaCloud } from "../client.mjs";
export type APIResponseProps = {
    response: Response;
    options: FinalRequestOptions;
    controller: AbortController;
    requestLogID: string;
    retryOfRequestLogID: string | undefined;
    startTime: number;
};
export declare function defaultParseResponse<T>(client: LlamaCloud, props: APIResponseProps): Promise<T>;
//# sourceMappingURL=parse.d.mts.map