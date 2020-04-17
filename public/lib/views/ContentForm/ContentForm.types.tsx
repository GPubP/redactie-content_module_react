import { FormikErrors, FormikValues } from 'formik';

import { ModuleSettings, ModuleValue } from '../../api/api.types';
import { ContentRouteProps } from '../../content.types';
import { ContentSchema, ContentsSchema } from '../../services/content/content.service.types';
import { ContentTypeSchema } from '../../services/contentTypes/contentTypes.service.types';

export interface ContentFormMatchProps {
	siteId: string;
	contentTypeId: string;
	compartment: string;
}

export interface ContentFormRouteProps<T> extends ContentRouteProps<T> {
	onSubmit: (values: FormikValues) => void;
	cancel: () => void;
	content?: ContentSchema;
	contentType: ContentTypeSchema;
	activeCompartment: string;
}

export interface CompartmentProps {
	contentType: ContentTypeSchema; // = deep clone
	contentVaue: ContentsSchema; // = deep clone
	settings: ModuleSettings; // = deep clone
	value: ModuleValue; // module data section
	isValid: boolean;

	onChange: (e: ModuleValue) => FormikErrors<any>[] | null; // Boolean for validation result (maybe?)
	updateContent: (e: ContentsSchema) => FormikErrors<any>[] | null; // For edge cases where content item must be changed. Boolean for validation
}
