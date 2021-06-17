import moment from 'moment';

import { ContentSchema } from '../../api/api.types';
import {
	META_VALIDATION_SCHEMA,
	MetaForm,
	MetaFormHelper,
	PlanningForm,
	STATUS_VALIDATION_SCHEMA,
	StatusForm,
} from '../../components';
import { PLANNING_VALIDATION_SCHEMA } from '../../components/forms/PlanningForm/PlanningForm.const';
import { DATE_FORMATS, MODULE_PATHS, TENANT_ROOT } from '../../content.const';
import { CONTENT_STATUS_TRANSLATION_MAP, ContentStatus } from '../../services/content';
import { CompartmentType, ContentCompartmentModel } from '../../store/ui/contentCompartments';

export const INTERNAL_COMPARTMENTS = (siteId: string): ContentCompartmentModel[] => [
	{
		label: 'Info',
		getDescription: contentItem => {
			if (!contentItem?.meta.lastModified) {
				return;
			}
			const formattedDate = moment(contentItem?.meta.lastModified).format(
				DATE_FORMATS.dateAndTime
			);
			return `Laatst bewerkt op ${formattedDate}`;
		},
		name: 'meta',
		slug: 'informatie',
		component: MetaForm,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: (values, ac, options) =>
			META_VALIDATION_SCHEMA(siteId, values.uuid, options).isValid(values.meta),
		afterSubmit: MetaFormHelper.afterSubmitMeta,
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
	{
		label: 'Planning',
		getDescription: contentItem => {
			if (!contentItem?.meta.publishTime && !contentItem?.meta.unpublishTime) {
				return;
			}

			const formattedDate = moment(
				contentItem?.meta.publishTime || contentItem?.meta.unpublishTime
			).format(DATE_FORMATS.dateAndTime);

			let description = '';

			if (contentItem?.meta.publishTime) {
				description = `Publicatie op ${formattedDate}`;
			}

			if (contentItem?.meta.unpublishTime) {
				description = `
					${description ? description + '<br>' : ''}Archivering op ${formattedDate}
				`;
			}

			return description;
		},
		name: 'planning',
		slug: 'planning',
		component: PlanningForm,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: (values: ContentSchema) =>
			PLANNING_VALIDATION_SCHEMA(values.meta.publishTime as string).isValidSync(values.meta),
	},
];

export const CONTENT_CREATE_ALLOWED_PATHS = [
	`${TENANT_ROOT}/sites${MODULE_PATHS.createCompartment}`,
	`${TENANT_ROOT}/sites${MODULE_PATHS.detailEditCompartment}`,
];
export const CONTENT_EDIT_ALLOWED_PATHS = [
	`${TENANT_ROOT}/sites${MODULE_PATHS.detailEditCompartment}`,
];
