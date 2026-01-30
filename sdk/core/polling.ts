// File manually added for polling utilities. See CONTRIBUTING.md for details.

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
export class PollingTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PollingTimeoutError';
  }
}

/**
 * Raised when a job fails during polling.
 */
export class PollingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PollingError';
  }
}

/**
 * Calculate the next polling interval based on backoff strategy.
 */
function calculateNextInterval(
  currentInterval: number,
  backoff: BackoffStrategy,
  maxInterval: number,
): number {
  if (backoff === 'constant') {
    return currentInterval;
  } else if (backoff === 'linear') {
    return Math.min(currentInterval + 1.0, maxInterval);
  } else if (backoff === 'exponential') {
    return Math.min(currentInterval * 2.0, maxInterval);
  }
  return currentInterval;
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
export async function pollUntilComplete<T>(
  getStatusFn: () => Promise<T>,
  isCompleteFn: (status: T) => boolean,
  isErrorFn: (status: T) => boolean,
  getErrorMessageFn: (status: T) => string,
  options: PollingOptions = {},
): Promise<T> {
  const {
    pollingInterval = 1.0,
    maxInterval = 5.0,
    timeout = 2000.0,
    backoff = 'linear',
    verbose = false,
  } = options;

  const startTime = Date.now();
  let tries = 0;
  let currentInterval = pollingInterval;

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, currentInterval * 1000));
    tries++;

    // Get current status
    const status = await getStatusFn();

    // Check if complete
    if (isCompleteFn(status)) {
      if (verbose && tries > 1) {
        console.log(`\nCompleted after ${tries} checks`);
      }
      return status;
    }

    // Check if error
    if (isErrorFn(status)) {
      const errorMsg = getErrorMessageFn(status);
      throw new PollingError(errorMsg);
    }

    // Check timeout
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed > timeout) {
      throw new PollingTimeoutError(`Polling timed out after ${elapsed.toFixed(1)}s (timeout: ${timeout}s)`);
    }

    // Print progress
    if (verbose && tries % 10 === 0) {
      process.stdout.write('.');
    }

    // Calculate next interval
    currentInterval = calculateNextInterval(currentInterval, backoff, maxInterval);
  }
}
