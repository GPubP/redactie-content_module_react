export const BREADCRUMB_OPTIONS = {
	excludePaths: [
		'/',
		'/:tenantId',
		'/:tenantId/sites/:siteId/content/content-type',
		'/:tenantId/sites/:siteId/content/content-type/:contentTypeId',
		'/:tenantId/sites/:siteId/content/:contentId',
	],
};

const siteRoot = '/content';
const root = `/:siteId${siteRoot}`;
const overview = `${root}/overzicht`;
const create = `${root}/content-type/:contentTypeId/aanmaken`;
const createCompartment = `${create}/:compartment`;
const update = `${root}/:contentId/bewerken`;
const updateCompartment = `${update}/:compartment`;

export const MODULE_PATHS = {
	root,
	siteRoot,
	overview,
	create,
	createCompartment,
	update,
	updateCompartment,
};
