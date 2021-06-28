import { FormSchema } from '@redactie/form-renderer-module';
import { FormikProps, FormikValues } from 'formik';

import { ModuleSettings, ModuleValue } from '../../api/api.types';
import { ContentRouteProps } from '../../content.types';
import { ContentSchema } from '../../services/content/content.service.types';
import {
	ContentTypeSchema,
	ErrorMessagesSchema,
	ValidateSchema,
} from '../../services/contentTypes/contentTypes.service.types';
import { ContentCompartmentModel } from '../../store/ui/contentCompartments';

export interface FormRendererProps {
	schema: FormSchema;
	validationSchema: ValidateSchema;
	errorMessages: ErrorMessagesSchema;
}

export interface ContentFormMatchProps {
	siteId: string;
	contentTypeId: string;
	compartment: string;
	contentId: string;
}

export interface ContentFormRouteProps<T> extends ContentRouteProps<T> {
	contentType: ContentTypeSchema;
	contentItemDraft: ContentSchema;
	contentItem: ContentSchema;
	hasChanges: boolean;
	isCreating?: boolean;
	showPublishedStatus?: boolean;
	onCancel: () => void;
	onSubmit: (
		content: ContentSchema,
		activeCompartment: ContentCompartmentModel,
		compartments: ContentCompartmentModel[]
	) => void;
	onStatusClick: () => void;
	onUpdatePublication: (content: ContentSchema) => void;
}

export type CtTypeSettings = Pick<
	ContentTypeSchema,
	'valueSyncMap' | 'fields' | 'validateSchema' | 'errorMessages'
> & { includeWorkingTitle: boolean };

export interface CompartmentProps<
	M = ModuleValue,
	S = ModuleSettings | CtTypeSettings | ContentTypeSchema | undefined
> {
	contentType: ContentTypeSchema;
	contentValue: ContentSchema | undefined;
	contentItem: ContentSchema | undefined;
	settings: S;
	value: M; // module data section
	isValid: boolean;
	isCreating: boolean;
	formikRef?: (instance: FormikProps<FormikValues> | null) => void;
	onChange: (e: M) => void; // Boolean for validation result (maybe?)
	updateContent: (e: ContentSchema) => void; // For edge cases where content item must be changed. Boolean for validation
}
