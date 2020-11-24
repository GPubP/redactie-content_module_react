export interface WorkerMessageEvent<T> extends MessageEvent {
	data: T;
}

export type WorkerPostMessage<T = any> = (message: T) => void;
export type WorkerOnMessage<T = any> = (e: WorkerMessageEvent<T>) => void;

export interface WorkerCtx {
	postMessage: WorkerPostMessage;
	onmessage: WorkerOnMessage;
}
