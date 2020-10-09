export const TENANT_ROOT = '/:tenantId';

export const BREADCRUMB_OPTIONS = {
	excludePaths: [
		'/',
		`${TENANT_ROOT}`,
		`${TENANT_ROOT}/sites`,
		`${TENANT_ROOT}/sites/:siteId/content`,
		`${TENANT_ROOT}/sites/:siteId/content/:contentId/bekijk`,
		`${TENANT_ROOT}/sites/:siteId/content/:contentId/bewerk`,
		`${TENANT_ROOT}/sites/:siteId/content/:contentId/bewerk/:compartment`,
		`${TENANT_ROOT}/sites/:siteId/content/content-type`,
		`${TENANT_ROOT}/sites/:siteId/content/content-type/:contentTypeId`,
		`${TENANT_ROOT}/sites/:siteId/content/content-type/:contentTypeId/aanmaken`,
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
