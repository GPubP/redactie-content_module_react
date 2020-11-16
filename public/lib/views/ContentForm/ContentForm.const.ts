import moment from 'moment';
import { isEmpty } from 'ramda';

import { ContentSchema, ContentTypeSchema } from '../../api/api.types';
import {
	FieldsForm,
	META_VALIDATION_SCHEMA,
	MetaForm,
	STATUS_VALIDATION_SCHEMA,
	StatusForm,
} from '../../components';
import { getCustomValidator } from '../../connectors/formRenderer';
import { DATE_FORMATS, MODULE_PATHS, TENANT_ROOT, WORKING_TITLE_KEY } from '../../content.const';
import { addWorkingTitleField, getFormPropsByCT } from '../../helpers';
import { CONTENT_STATUS_TRANSLATION_MAP, ContentStatus } from '../../services/content';
import { CompartmentType, ContentCompartmentModel } from '../../store/ui/contentCompartments';

export const INTERNAL_COMPARTMENTS = (
	contentType: ContentTypeSchema
): ContentCompartmentModel[] => [
	{
		label: 'Inhoud',
		name: 'fields',
		slug: 'inhoud',
		component: FieldsForm,
		type: CompartmentType.CT,
		isValid: false,
		validate: (values: ContentSchema) => {
			const formProps = getFormPropsByCT(contentType);
			const { validationSchema, errorMessages } = addWorkingTitleField(formProps);
			const CustomValidator = getCustomValidator();

			if (validationSchema && CustomValidator) {
				const validator = new CustomValidator(validationSchema, errorMessages, {
					allErrors: true,
					messages: true,
				});

				const errors = validator.validate({
					...values.fields,
					[WORKING_TITLE_KEY]: values.meta.label,
				}) as boolean;

				return isEmpty(errors);
			}
			// If no validationSchema is found return compartment as valid
			return true;
		},
	},
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

export const CONTENT_CREATE_ALLOWED_PATHS = [
	`${TENANT_ROOT}/sites${MODULE_PATHS.createCompartment}`,
	`${TENANT_ROOT}/sites${MODULE_PATHS.detailEditCompartment}`,
];
export const CONTENT_EDIT_ALLOWED_PATHS = [
	`${TENANT_ROOT}/sites${MODULE_PATHS.detailEditCompartment}`,
];
