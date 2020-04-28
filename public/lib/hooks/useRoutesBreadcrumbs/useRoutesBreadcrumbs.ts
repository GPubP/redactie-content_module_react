import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { ReactNode } from 'react';

import { BREADCRUMB_OPTIONS } from '../../content.const';
import useRoutes from '../useRoutes/useRoutes';

const useRoutesBreadcrumbs = (): ReactNode => {
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);

	return breadcrumbs;
};

export default useRoutesBreadcrumbs;
