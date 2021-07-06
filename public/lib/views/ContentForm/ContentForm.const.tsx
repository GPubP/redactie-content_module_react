import moment from 'moment';
import React, { ReactElement } from 'react';

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

export const CONTENT_MODAL_MAP = (
	title: string,
	date: string | undefined
): { [key: string]: { title: string; message: ReactElement; confirm: string } } => ({
	publish: {
		title: `${title} nu publiceren`,
		message: <>Je staat op het punt om dit content item te publiceren. Weet je het zeker?</>,
		confirm: 'Ok, publiceer',
	},
	unpublish: {
		title: `${title} nu archiveren`,
		message: <>Je staat op het punt om dit content item te archiveren. Weet je het zeker?</>,
		confirm: 'Ok, archiveer',
	},
	updatePublication: {
		title: `Publicatie van ${title} bijwerken`,
		message: (
			<>
				Je staat op het punt om de publicatie van dit content item bij te werken. Weet je
				het zeker?
			</>
		),
		confirm: 'Ok, werk bij',
	},
	publishWithUnpublishTime: {
		title: `${title} nu publiceren`,
		message: (
			<>
				Je staat op het punt om dit content item te publiceren. Weet je het zeker? Dit
				content item wordt binnenkort automatisch gearchiveerd. De archiveringsdatum staat
				ingesteld op <strong>{moment(date).format(DATE_FORMATS.date)}</strong> om{' '}
				<strong>{moment(date).format(DATE_FORMATS.time)}</strong>. Bekijk de planning indien
				deze datum niet correct is.
			</>
		),
		confirm: 'Ok, publiceer',
	},
	publishWithInvalidUnpublishTime: {
		title: `${title} publiceren is niet mogelijk`,
		message: (
			<>
				Dit content item kan niet gepubliceerd worden. De archiveringsdatum van dit content
				item staat ingesteld op <strong>{moment(date).format(DATE_FORMATS.date)}</strong> om{' '}
				<strong>{moment(date).format(DATE_FORMATS.time)}</strong>. Dat is een datum die in
				het verleden ligt. Bekijk de planning indien deze datum niet correct is. Wanneer u
				verder gaat wordt dit content item meteen gearchiveerd.
			</>
		),
		confirm: 'Ok, archiveer',
	},
});

export const CONTENT_ALERT_MAP = (
	date: string
): {
	[key: string]: {
		type: 'danger' | 'warning';
		title: string;
		message: ReactElement;
		confirm?: string;
	};
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
		confirm: 'Publiceer nu',
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
		confirm: 'Archiveer nu',
	},
});
