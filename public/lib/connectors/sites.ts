import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import { Routes } from '@redactie/redactie-core/dist/routes/routes.types';

// TODO export sites api typings
const sitesAPI: { routes: Routes } = Core.modules.getModuleAPI('sites-module') as {
	routes: Routes;
};

export const registerRoutes = (routes: ModuleRouteConfig): any | false =>
	sitesAPI ? sitesAPI.routes.register(routes) : false;
