import { useWorker } from '@redactie/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { HasChangesWorkerData } from '../../workers/hasChanges/hasChanges.types';

const useValueChanges = (isLoaded: boolean, value: unknown): [boolean, Function] => {
	const [currentValue, setCurrentValue] = useState<any>();
	const data = useMemo<HasChangesWorkerData>(
		() => ({
			currentValue,
			nextValue: value,
			isLoaded,
		}),
		[isLoaded, value, currentValue]
	);
	const [hasChanges] = useWorker<HasChangesWorkerData, boolean>(
		BFF_MODULE_PUBLIC_PATH,
		'hasChanges.worker',
		data,
		false
	);

	const reset = useCallback(() => {
		setCurrentValue(undefined);
	}, []);

	useEffect(() => {
		if (!isLoaded) {
			return;
		}

		if (!currentValue) {
			setCurrentValue(value);
		}
	}, [value, isLoaded, currentValue]);

	return [!!hasChanges, reset];
};

export default useValueChanges;
