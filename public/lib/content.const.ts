export const BREADCRUMB_OPTIONS = {
	excludePaths: [
		'/',
		'/:tenantId',
		'/:tenantId/sites',
		'/:tenantId/sites/:siteId/content',
		'/:tenantId/sites/:siteId/content/:contentId',
		'/:tenantId/sites/:siteId/content/:contentId/bewerken',
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
const detail = `${root}/:contentId/detail`;
const detailView = `${detail}/bekijk`;
const detailEdit = `${detail}/bewerk`;

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
};
