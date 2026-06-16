export const mimeToExtension: Record<string, string> = {
	'application/pdf': '.pdf',
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/gif': '.gif',
	'image/webp': '.webp',
	'image/svg+xml': '.svg',
	'image/tiff': '.tiff',
	'application/msword': '.doc',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
	'application/vnd.ms-excel': '.xls',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
	'application/vnd.ms-powerpoint': '.ppt',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
	'application/vnd.oasis.opendocument.text': '.odt',
	'application/vnd.oasis.opendocument.spreadsheet': '.ods',
	'application/vnd.oasis.opendocument.presentation': '.odp',
};

class Timer {
	private timers: Map<number, { callback: () => void; endTime: number; cancelled: boolean }> =
		new Map();
	private nextId: number = 1;

	setTimeout(callback: () => void, delay: number): number {
		const id = this.nextId++;
		const endTime = Date.now() + delay;
		const timerData = { callback, endTime, cancelled: false };

		this.timers.set(id, timerData);

		// Start the non-blocking wait
		this.waitAndExecute(id, timerData);

		return id;
	}

	clearTimeout(id: number): void {
		const timer = this.timers.get(id);
		if (timer) {
			timer.cancelled = true;
			this.timers.delete(id);
		}
	}

	private async waitAndExecute(
		id: number,
		timerData: { callback: () => void; endTime: number; cancelled: boolean },
	): Promise<void> {
		// Non-blocking polling loop
		while (Date.now() < timerData.endTime) {
			if (timerData.cancelled) {
				return;
			}
			// Yield control back to event loop
			await this.yieldControl();
		}

		// Check if cancelled before executing
		if (!timerData.cancelled) {
			this.timers.delete(id);
			timerData.callback();
		}
	}

	private yieldControl(): Promise<void> {
		// Use Promise to yield control to the event loop without blocking
		return new Promise((resolve) => {
			// Use queueMicrotask for immediate yielding, or Promise.resolve() chain
			Promise.resolve().then(() => resolve());
		});
	}
}

const timer = new Timer();

export function setTimeout(callback: () => void, delay: number): number {
	return timer.setTimeout(callback, delay);
}

export function clearTimeout(id: number): void {
	timer.clearTimeout(id);
}

// ---------------------------------------------------------------------------
// HTTP helpers used by every node. We deliberately avoid the LlamaCloud SDK
// for the actual requests because its multipart path and request layer have
// caused upload hangs / silent failures in some environments (chunked
// transfer-encoded FormData stalling upstream). Plain `fetch` with explicit
// Content-Length-friendly bodies works reliably.
// ---------------------------------------------------------------------------

export interface LlamaHttpOptions {
	apiKey: string;
	baseUrl: string;
}

export interface BinaryFileInput {
	buffer: Buffer;
	mimeType: string;
	fileName?: string;
	fileExtension?: string;
}

/** Compute a filename that has exactly one extension. */
export function resolveFileName(input: BinaryFileInput): string {
	const rawName = input.fileName ?? 'file';
	const hasExt = /\.[^./\\]+$/.test(rawName);
	const extFromBinary = input.fileExtension
		? input.fileExtension.startsWith('.')
			? input.fileExtension
			: '.' + input.fileExtension
		: mimeToExtension[input.mimeType];
	if (!hasExt && !extFromBinary) {
		throw new Error(`Unsupported file type: ${input.mimeType}`);
	}
	return hasExt ? rawName : rawName + extFromBinary;
}

/** Strip trailing slashes from baseUrl. */
export function apiBase(baseUrl: string): string {
	return baseUrl.replace(/\/$/, '');
}

/** Common auth headers for JSON requests. */
export function authHeaders(apiKey: string): Record<string, string> {
	return {
		Authorization: `Bearer ${apiKey}`,
		Accept: 'application/json',
	};
}

/**
 * Upload a file to LlamaCloud (POST /api/v1/beta/files) and return its id.
 * Throws on non-2xx with the server's response body included.
 */
export async function uploadFile(opts: LlamaHttpOptions, input: BinaryFileInput): Promise<string> {
	const fileName = resolveFileName(input);
	const form = new FormData();
	form.append('file', new Blob([new Uint8Array(input.buffer)], { type: input.mimeType }), fileName);
	form.append('purpose', 'parse');

	const url = `${apiBase(opts.baseUrl)}/api/v1/beta/files`;
	const res = await fetch(url, {
		method: 'POST',
		headers: { Authorization: `Bearer ${opts.apiKey}` },
		body: form,
	});
	if (!res.ok) {
		const errText = await res.text().catch(() => '');
		throw new Error(`Upload failed: HTTP ${res.status} ${res.statusText}: ${errText}`);
	}
	const json = (await res.json()) as { id: string };
	return json.id;
}

/** POST JSON and return the parsed JSON response. */
export async function postJSON<T = any>(
	opts: LlamaHttpOptions,
	path: string,
	body: unknown,
): Promise<T> {
	const res = await fetch(`${apiBase(opts.baseUrl)}${path}`, {
		method: 'POST',
		headers: { ...authHeaders(opts.apiKey), 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const errText = await res.text().catch(() => '');
		throw new Error(`POST ${path} failed: HTTP ${res.status} ${res.statusText}: ${errText}`);
	}
	return (await res.json()) as T;
}

/** GET JSON and return the parsed response. `query` is appended as ?k=v&... */
export async function getJSON<T = any>(
	opts: LlamaHttpOptions,
	path: string,
	query?: Record<string, string | number | boolean | string[] | undefined>,
): Promise<T> {
	let url = `${apiBase(opts.baseUrl)}${path}`;
	if (query) {
		const usp = new URLSearchParams();
		for (const [k, v] of Object.entries(query)) {
			if (v === undefined) continue;
			if (Array.isArray(v)) {
				for (const item of v) usp.append(k, String(item));
			} else {
				usp.append(k, String(v));
			}
		}
		const qs = usp.toString();
		if (qs) url += `?${qs}`;
	}
	const res = await fetch(url, { method: 'GET', headers: authHeaders(opts.apiKey) });
	if (!res.ok) {
		const errText = await res.text().catch(() => '');
		throw new Error(`GET ${path} failed: HTTP ${res.status} ${res.statusText}: ${errText}`);
	}
	return (await res.json()) as T;
}

/**
 * Poll a getter until it signals completion. Uses the non-blocking timer above.
 * `isDone` returns true on success, `isError` on terminal failure. Throws on
 * timeout or terminal failure with the supplied error message extractor.
 */
export async function pollUntil<T>(
	getStatus: () => Promise<T>,
	isDone: (r: T) => boolean,
	isError: (r: T) => boolean,
	getErrorMessage: (r: T) => string,
	options: { timeoutMs?: number; intervalMs?: number; maxIntervalMs?: number; label?: string } = {},
): Promise<T> {
	const timeoutMs = options.timeoutMs ?? 5 * 60_000;
	const maxIntervalMs = options.maxIntervalMs ?? 5_000;
	const label = options.label ?? 'job';
	let intervalMs = options.intervalMs ?? 1_000;
	const start = Date.now();
	while (true) {
		if (Date.now() - start > timeoutMs) {
			throw new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s`);
		}
		const result = await getStatus();
		if (isDone(result)) return result;
		if (isError(result)) throw new Error(getErrorMessage(result));
		await new Promise<void>((r) => setTimeout(() => r(), intervalMs));
		intervalMs = Math.min(intervalMs * 1.5, maxIntervalMs);
	}
}
