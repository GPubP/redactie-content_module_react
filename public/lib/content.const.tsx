import moment from 'moment';
import React, { ReactElement } from 'react';

export const TENANT_ROOT = '/:tenantId';
export const SITES_ROOT = 'sites';

export const BREADCRUMB_OPTIONS = {
	excludePaths: [
		'/',
		`${TENANT_ROOT}`,
		`${TENANT_ROOT}/sites`,
		`${TENANT_ROOT}/sites/:siteId`,
		`${TENANT_ROOT}/sites/:siteId/content/content-types`,
		`${TENANT_ROOT}/sites/:siteId/content/content-types/:contentTypeId([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})/content`,
		`${TENANT_ROOT}/sites/:siteId/content/content-types/:contentTypeId([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})`,
	],
};

export const urlSiteParam = 'siteId';
const siteRoot = '/content';
const root = `/:${urlSiteParam}${siteRoot}`;
const overview = `${root}/overzicht`;
const createOverview = `${root}/aanmaak-overzicht`;
const create = `${root}/content-types/:contentTypeId/aanmaken`;
const createCompartment = `${create}/:compartment`;
const detail = `${root}/content-types/:contentTypeId/content/:contentId`;
const detailView = `${detail}/bekijk`;
const detailEdit = `${detail}/bewerk`;
const detailEditCompartment = `${detailEdit}/:compartment`;

export const DATE_FORMATS = {
	date: 'DD/MM/YYYY',
	dateAndTime: 'DD/MM/YYYY [-] HH[u]mm',
	time: 'HH[u]mm',
};

export const CONTENT_MODAL_MAP = (
	title: string,
	date: string | undefined
): {
	[key: string]: {
		title: string;
		message: ReactElement;
		confirm: string;
		confirmButtonIcon?: string;
		confirmButtonType?: string;
		action?: string;
	};
} => ({
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
	remove: {
		title: `Verwijderen?`,
		message: (
			<>Ben je zeker dat je dit item wil verwijderen? Dit kan niet ongedaan gemaakt worden.</>
		),
		confirm: 'Ja, verwijder',
		confirmButtonType: 'danger',
		confirmButtonIcon: 'trash-o',
		action: 'remove',
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

export const MODULE_PATHS = {
	root,
	siteRoot,
	overview,
	createOverview,
	create,
	createCompartment,
	detail,
	detailView,
	detailEdit,
	detailEditCompartment,
};

export const ALERT_CONTAINER_IDS = {
	contentEdit: 'content-edit',
	contentCreate: 'content-create',
	contentRemove: 'content-remove',
};

export const WORKING_TITLE_KEY = 'working-title';

export const DEFAULT_CRUD_RIGHTS = {
	read: false,
	create: false,
	update: false,
	delete: false,
};

export const CONTENT_TYPE_CRUD_RIGHT_KEYS = {
	read: 'content_read',
	create: 'content_create',
	update: 'content_update',
	delete: 'content_delete',
};
