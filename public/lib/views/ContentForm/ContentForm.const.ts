import { ContentSchema } from '../../api/api.types';
import {
	FieldsForm,
	META_VALIDATION_SCHEMA,
	MetaForm,
	STATUS_VALIDATION_SCHEMA,
	StatusForm,
} from '../../components';
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
		name: 'meta',
		slug: 'informatie',
		component: MetaForm,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: (values: ContentSchema) => META_VALIDATION_SCHEMA.isValidSync(values.meta),
	},
	{
		label: 'Status',
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
