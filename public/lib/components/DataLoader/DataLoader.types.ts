import { LoadingState } from '@redactie/utils';
import { ReactElement } from 'react';

export interface DataLoaderProps {
	errorMessage?: string;
	loadingState: LoadingState;
	notFoundMessage?: string;
	render: () => ReactElement | null;
}
