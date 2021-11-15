import { Button } from '@acpaas-ui/react-components';
import { WorkflowDetailModel, WorkflowPopulatedTransition } from '@redactie/workflows-module';
import moment from 'moment';
import React from 'react';

import { ContentSchema, ContentTypeSchema } from '../../api/api.types';
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
import { CompartmentType, ContentCompartmentModel } from '../../store/ui/contentCompartments';

import { AlertState } from './ContentForm.types';

export const INTERNAL_COMPARTMENTS = (
	siteId: string,
	contentType?: ContentTypeSchema,
	workflow?: WorkflowDetailModel,
	allowedWorkflowStates?: string[]
): ContentCompartmentModel[] => [
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
			META_VALIDATION_SCHEMA(
				siteId,
				values.uuid,
				options,
				contentType?.meta?.canBeFiltered
			).isValid(values.meta),
		afterSubmit: MetaFormHelper.afterSubmitMeta,
	},
	{
		label: 'Status',
		getDescription: contentItem => {
			if (!contentItem?.meta.workflowState || !workflow) {
				return;
			}

			let status = '';

			for (const transition of workflow?.data.transitions as WorkflowPopulatedTransition[]) {
				if (transition.from.data.systemName === contentItem?.meta.workflowState) {
					status = transition.from.data.name;
					break;
				}

				if (transition.to.data.systemName === contentItem?.meta.workflowState) {
					status = transition.to.data.name;
					break;
				}
			}

			return status;
		},
		name: 'status',
		slug: 'status',
		component: StatusForm,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: (values: ContentSchema) =>
			STATUS_VALIDATION_SCHEMA(allowedWorkflowStates as string[]).isValidSync(values.meta),
	},
	{
		label: 'Planning',
		getDescription: contentItem => {
			if (!contentItem?.meta.publishTime && !contentItem?.meta.unpublishTime) {
				return;
			}

			let description = '';

			if (contentItem?.meta.publishTime) {
				const formattedDate = moment(contentItem?.meta.publishTime).format(
					DATE_FORMATS.dateAndTime
				);

				description = `Publicatie op ${formattedDate}`;
			}

			if (contentItem?.meta.unpublishTime) {
				const formattedDate = moment(contentItem?.meta.unpublishTime).format(
					DATE_FORMATS.dateAndTime
				);

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

export enum ContentModalStatus {
	publish = 'publish',
	publishWithArchiveTime = 'publishWithArchiveTime',
	updatePublication = 'updatePublication',
}

const DefaultWarningAlertMessage: AlertState['actions'] = ({
	navigate,
	siteId,
	contentId,
	contentTypeId,
}) => (
	<Button
		type="warning"
		onClick={() =>
			navigate(`${MODULE_PATHS.detailEdit}/planning`, {
				siteId,
				contentId,
				contentTypeId,
			})
		}
	>
		Bekijk planning
	</Button>
);

export const CONTENT_ALERT_MAP = ({
	date = '',
}: {
	date: string;
}): {
	[key: string]: AlertState;
} => ({
	publishTime: {
		type: 'warning',
		title: 'Publicatiedatum ingesteld',
		message: (
			<>
				Dit content item wordt binnenkort automatisch gepubliceerd. De publicatiedatum staat
				ingesteld op <strong>{moment(date).format(DATE_FORMATS.date)}</strong> om{' '}
				<strong>{moment(date).format(DATE_FORMATS.time)}</strong>. Bekijk de planning indien
				deze datum niet correct is.
			</>
		),
		actions: DefaultWarningAlertMessage,
		cancel: true,
		cancelLabel: 'Behoud datum',
	},
	unpublishTime: {
		type: 'warning',
		title: 'Archiveringsdatum ingesteld',
		message: (
			<>
				Dit content item wordt binnenkort automatisch gearchiveerd. De archiveringsdatum
				staat ingesteld op <strong>{moment(date).format(DATE_FORMATS.date)}</strong> om{' '}
				<strong>{moment(date).format(DATE_FORMATS.time)}</strong>. Bekijk de planning indien
				deze datum niet correct is.
			</>
		),
		actions: DefaultWarningAlertMessage,
		cancel: true,
		cancelLabel: 'Behoud datum',
	},
	invalidPublishTime: {
		type: 'danger',
		title: 'Opgelet, de publicatiedatum ligt in het verleden',
		message: (
			<>
				De publicatiedatum van dit content item staat ingesteld op{' '}
				<strong>{moment(date).format(DATE_FORMATS.date)}</strong> om{' '}
				<strong>{moment(date).format(DATE_FORMATS.time)}</strong>. Dat is een datum die in
				het verleden ligt. Je kan het item nu meteen publiceren of de publicatiedatum
				aanpassen naar een datum in de toekomst.
			</>
		),
		confirm: true,
		confirmLabel: 'Publiceer nu',
		cancel: true,
		cancelLabel: 'Herbekijk planning',
	},
	invalidUnpublishTime: {
		type: 'danger',
		title: 'Opgelet, de archivatiedatum ligt in het verleden',
		message: (
			<>
				De archiveringsdatum van dit content item staat ingesteld op{' '}
				<strong>{moment(date).format(DATE_FORMATS.date)}</strong> om{' '}
				<strong>{moment(date).format(DATE_FORMATS.time)}</strong>. Dat is een datum die in
				het verleden ligt. Je kan het item nu meteen archiveren of de archiveringsdatum
				aanpassen naar een datum in de toekomst.
			</>
		),
		confirm: true,
		confirmLabel: 'Archiveer nu',
		cancel: true,
		cancelLabel: 'Herbekijk planning',
	},
	publishTimeNonPending: {
		type: 'warning',
		title: 'De pagina of wijzigingen zullen niet online verschijnen op de publicatiedatum',
		message: (
			<>
				Je hebt de publicatiedatum ingesteld op{' '}
				<strong>{moment(date).format(DATE_FORMATS.date)}</strong> om{' '}
				<strong>{moment(date).format(DATE_FORMATS.time)}</strong>. De pagina zal alleen
				online verschijnen op de gekozen datum als je de status &quot;Klaar voor
				publicatie&quot; kiest.
			</>
		),
		actions({ navigate, siteId, contentId, contentTypeId }) {
			return (
				<Button
					type="warning"
					onClick={() =>
						navigate(`${MODULE_PATHS.detailEdit}/status`, {
							siteId,
							contentId,
							contentTypeId,
						})
					}
				>
					Bekijk statussen
				</Button>
			);
		},
	},
	cannotTransition: {
		type: 'warning',
		title: 'Je kan het content item niet bewerken',
		message: <>De ingestelde workflow rechten laten dit niet toe voor jouw rol.</>,
	},
});
