export const BREADCRUMB_OPTIONS = {
	excludePaths: [
		'/',
		'/:tenantId',
		'/:tenantId/sites',
		'/:tenantId/sites/:siteId/content',
		'/:tenantId/sites/:siteId/content/:contentId/bekijk',
		'/:tenantId/sites/:siteId/content/:contentId/bewerk',
		'/:tenantId/sites/:siteId/content/:contentId/bewerk/:compartment',
		'/:tenantId/sites/:siteId/content/content-type',
		'/:tenantId/sites/:siteId/content/content-type/:contentTypeId',
		'/:tenantId/sites/:siteId/content/content-type/:contentTypeId/aanmaken',
	],
};

export const urlSiteParam = 'siteId';
const siteRoot = '/content';
const root = `/:${urlSiteParam}${siteRoot}`;
const overview = `${root}/overzicht`;
const createOverview = `${root}/aanmaak-overzicht`;
const create = `${root}/content-type/:contentTypeId/aanmaken`;
const createCompartment = `${create}/:compartment`;
const detail = `${root}/:contentId`;
const detailView = `${detail}/bekijk`;
const detailEdit = `${detail}/bewerk`;
const detailEditCompartment = `${detailEdit}/:compartment`;

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
};

export const WORKING_TITLE_KEY = 'working-title';

export const DATE_FORMATS = {
	date: 'DD/MM/YYYY',
	dateAndTime: 'DD/MM/YYYY [-] HH[u]mm',
};
