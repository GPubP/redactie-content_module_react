// TODO: replace to redactie-utils because it contains redactie specific paths
import { useContext, useEffect, useState } from 'react';

import TenantContext from '../../context/TenantContext/TenantContext';
import { WorkerMessageEvent } from '../../workers/workers.types';

// You can pass a path to a worker or an instance of Worker
function useWorker<Data = any, ReturnValue = any>(
	workerOrPath: Worker | string,
	data: Data
): [ReturnValue | null, ErrorEvent | any] {
	const [worker, setWorker] = useState<Worker | null>(null);
	const [returnValue, setReturnValue] = useState<ReturnValue | null>(null);
	const [error, setError] = useState<ErrorEvent | any>(null);
	const { tenantId } = useContext(TenantContext);

	useEffect(() => {
		// Worker not supported so skip functionality
		if (!Worker) {
			return;
		}

		if (typeof workerOrPath === 'string') {
			setWorker(
				new Worker(
					`/v1/tenants/${tenantId}/bundles/${BFF_MODULE_PUBLIC_PATH}${workerOrPath}.umd.js`
				)
			);
		}

		if (workerOrPath instanceof Worker) {
			setWorker(workerOrPath);
		}

		return () => {
			worker && worker.terminate();
		};
	}, [Worker, tenantId, workerOrPath]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!worker || !data) {
			return;
		}

		worker.postMessage(data);
	}, [data, worker]);

	useEffect(() => {
		if (!worker) {
			return;
		}

		const messsageListener = (e: WorkerMessageEvent<ReturnValue>): void =>
			setReturnValue(e.data);
		const errorListener = (e: ErrorEvent): void => setError(e);

		worker.addEventListener('message', messsageListener);
		worker.addEventListener('error', errorListener);

		return () => {
			worker.removeEventListener('message', messsageListener);
			worker.removeEventListener('error', errorListener);
		};
	}, [worker]);

	return [returnValue, error];
}

export default useWorker;
