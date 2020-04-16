import { FormikErrors, FormikValues } from 'formik';

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
	onSubmit: (values: ContentSchema) => void;
	cancel: () => void;
	contentType: ContentTypeSchema;
	activeCompartment: string;
}

export interface CompartmentProps {
	contentType: ContentTypeSchema; // = deep clone
	contentValue: ContentSchema | undefined; // = deep clone
	settings: ModuleSettings | ContentTypeSchema['fields'] | ContentTypeSchema | undefined; // = deep clone
	value: ModuleValue; // module data section
	isValid: boolean;

	onChange: (e: ModuleValue) => void; // Boolean for validation result (maybe?)
	updateContent: (e: ContentSchema) => void; // For edge cases where content item must be changed. Boolean for validation
}
