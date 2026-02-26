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
