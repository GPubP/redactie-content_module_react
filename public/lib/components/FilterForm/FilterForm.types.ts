import { FormikState } from 'formik';

export type ResetForm = (nextState?: Partial<FormikState<FilterFormState>> | undefined) => void;

export interface FilterFormProps {
	initialState: FilterFormState;
	onCancel: (resetForm: ResetForm) => void;
	onSubmit: (values: FilterFormState) => void;
	deleteActiveFilter: (item: any) => void;
	activeFilters: Array<object>;
}

export interface FilterFormState {
	search: string;
	contentType: string;
	publishedFrom: string;
	publishedTo: string;
	status: string;
	published: string;
	author: string;
}

export enum PublishedStatuses {
	ONLINE = 'online',
	OFFLINE = 'offline',
}
