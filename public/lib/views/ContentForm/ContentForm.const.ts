import { FieldsForm, MetaForm, PlanningForm, StatusForm } from '../../components';
import { CompartmentType } from '../../store/ui/contentCompartments';

export const INTERNAL_COMPARTMENTS = [
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
	},
	{
		label: 'Status',
		name: 'status',
		slug: 'status',
		component: StatusForm,
		type: CompartmentType.INTERNAL,
	},
	{
		label: 'Planning',
		name: 'planning',
		slug: 'planning',
		component: PlanningForm,
		type: CompartmentType.INTERNAL,
	},
];
