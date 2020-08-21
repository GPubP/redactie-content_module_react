import { FormikState } from 'formik';

export type ResetForm = (nextState?: Partial<FormikState<FilterFormState>> | undefined) => void;

export interface FilterFormProps {
	siteId: string;
	initialState: FilterFormState;
	onCancel: () => void;
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
	creator: string;
}

export enum PublishedStatuses {
	ONLINE = 'online',
	OFFLINE = 'offline',
}