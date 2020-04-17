import { FormikValues } from 'formik';

import { ContentRouteProps } from '../../content.types';
import { ContentSchema } from '../../services/content/content.service.types';
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
