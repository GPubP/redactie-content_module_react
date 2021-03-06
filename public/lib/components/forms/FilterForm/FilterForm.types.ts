import { LanguageSchema } from '@redactie/language-module';
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
	languageOptions: SelectOption[];
}

export interface FilterFormState {
	search: string;
	contentTypes: string[];
	lastModifiedFrom: string;
	lastModifiedTo: string;
	status: string;
	published: string;
	creator: string;
	lang: string[];
}

export enum PublishedStatuses {
	ONLINE = 'online',
	OFFLINE = 'offline',
}
