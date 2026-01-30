/**
 * Backoff strategy for polling intervals
 * - "constant": Keep the same polling interval
 * - "linear": Increase interval by 1 second each poll
 * - "exponential": Double the interval each poll
 */
export type BackoffStrategy = 'constant' | 'linear' | 'exponential';
/**
 * Raised when polling times out before completion.
 */
export declare class PollingTimeoutError extends Error {
    constructor(message: string);
}
/**
 * Raised when a job fails during polling.
 */
export declare class PollingError extends Error {
    constructor(message: string);
}
/**
 * Polling utility options
 */
export interface PollingOptions {
    /**
     * Initial polling interval in seconds (default: 1.0)
     */
    pollingInterval?: number | undefined;
    /**
     * Maximum polling interval for backoff in seconds (default: 5.0)
     */
    maxInterval?: number | undefined;
    /**
     * Maximum time to wait in seconds (default: 2000.0)
     */
    timeout?: number | undefined;
    /**
     * Backoff strategy for polling intervals (default: "linear")
     */
    backoff?: BackoffStrategy | undefined;
    /**
     * Print progress indicators every 10 polls (default: false)
     */
    verbose?: boolean | undefined;
}
/**
 * Asynchronous polling utility that polls until a job completes.
 *
 * @param getStatusFn - Async function to get the current status
 * @param isCompleteFn - Function to check if the status indicates completion
 * @param isErrorFn - Function to check if the status indicates an error
 * @param getErrorMessageFn - Function to extract error message from status
 * @param options - Polling configuration options
 * @returns The final status object when complete
 * @throws {PollingTimeoutError} If polling times out
 * @throws {PollingError} If the job fails
 */
export declare function pollUntilComplete<T>(getStatusFn: () => Promise<T>, isCompleteFn: (status: T) => boolean, isErrorFn: (status: T) => boolean, getErrorMessageFn: (status: T) => string, options?: PollingOptions): Promise<T>;
//# sourceMappingURL=polling.d.ts.map