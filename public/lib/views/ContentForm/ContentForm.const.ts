import moment from 'moment';

import { ContentSchema } from '../../api/api.types';
import {
	FieldsForm,
	META_VALIDATION_SCHEMA,
	MetaForm,
	STATUS_VALIDATION_SCHEMA,
	StatusForm,
} from '../../components';
import { CONTENT_STATUS_TRANSLATION_MAP, ContentStatus } from '../../services/content';
import { CompartmentType, ContentCompartmentModel } from '../../store/ui/contentCompartments';

export const INTERNAL_COMPARTMENTS: ContentCompartmentModel[] = [
	{
		label: 'Inhoud',
		name: 'fields',
		slug: 'inhoud',
		component: FieldsForm,
		type: CompartmentType.CT,
	},
	{
		label: 'Info',
		getDescription: contentItem => {
			if (!contentItem?.meta.lastModified) {
				return;
			}
			const formattedDate = moment(contentItem?.meta.lastModified).format(
				'DD/MM/YYYY [-] HH[u]mm'
			);
			return `Laatst bewerkt op ${formattedDate}`;
		},
		name: 'meta',
		slug: 'informatie',
		component: MetaForm,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: values => META_VALIDATION_SCHEMA.isValidSync(values.meta),
	},
	{
		label: 'Status',
		getDescription: contentItem =>
			contentItem?.meta.status &&
			CONTENT_STATUS_TRANSLATION_MAP[contentItem.meta.status as ContentStatus],
		name: 'status',
		slug: 'status',
		component: StatusForm,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: (values: ContentSchema) => STATUS_VALIDATION_SCHEMA.isValidSync(values.meta),
	},
	// TODO: Implement planning when the workflow engine is implemented
	// {
	// 	label: 'Planning',
	// 	name: 'planning',
	// 	slug: 'planning',
	// 	component: PlanningForm,
	// 	type: CompartmentType.INTERNAL,
	// 	isValid: false,
	// 	validate: (values: ContentSchema) => PLANNING_VALIDATION_SCHEMA.isValidSync(values),
	// },
];
