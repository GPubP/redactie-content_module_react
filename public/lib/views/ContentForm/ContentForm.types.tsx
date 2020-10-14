import { FormikProps, FormikValues } from 'formik';

import { ModuleSettings, ModuleValue } from '../../api/api.types';
import { ContentRouteProps } from '../../content.types';
import { ContentSchema } from '../../services/content/content.service.types';
import { ContentTypeSchema } from '../../services/contentTypes/contentTypes.service.types';

export interface ContentFormMatchProps {
	siteId: string;
	contentTypeId: string;
	compartment: string;
}

export interface ContentFormRouteProps<T> extends ContentRouteProps<T> {
	contentType: ContentTypeSchema;
	contentItemDraft: ContentSchema;
	contentItem: ContentSchema;
	hasChanges: boolean;
	isCreating?: boolean;
	showPublishedStatus?: boolean;
	onCancel: () => void;
	onSubmit: (content: ContentSchema) => void;
	onStatusClick: () => void;
	onUpdatePublication: (content: ContentSchema) => void;
}

export interface CompartmentProps {
	contentType: ContentTypeSchema;
	contentValue: ContentSchema | undefined;
	contentItem: ContentSchema | undefined;
	settings: ModuleSettings | ContentTypeSchema['fields'] | ContentTypeSchema | undefined;
	value: ModuleValue; // module data section
	isValid: boolean;
	formikRef?: (instance: FormikProps<FormikValues>) => void;
	onChange: (e: ModuleValue) => void; // Boolean for validation result (maybe?)
	updateContent: (e: ContentSchema) => void; // For edge cases where content item must be changed. Boolean for validation
}
