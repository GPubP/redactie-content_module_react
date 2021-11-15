import { SelectOption } from '@redactie/utils';
import { FormikState } from 'formik';

import { OverviewFilterItem } from '../../../content.types';

export type ResetForm = (nextState?: Partial<FormikState<FilterFormState>> | undefined) => void;

export interface FilterFormProps {
	siteId: string;
	initialState: FilterFormState;
	onCancel: () => void;
	onSubmit: (values: FilterFormState) => void;
	deleteActiveFilter: (item: OverviewFilterItem) => void;
	activeFilters: Array<object>;
	statusOptions: SelectOption[];
}

export interface FilterFormState {
	search: string;
	contentType: string[];
	publishedFrom: string;
	publishedTo: string;
	status: string;
	published: string;
	creator: string;
}

export enum PublishedStatuses {
	ONLINE = 'online',
	OFFLINE = 'offline',
}
