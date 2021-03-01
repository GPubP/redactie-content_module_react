import { Breadcrumb, ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { useNavigate, useRoutes } from '@redactie/utils';
import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { BREADCRUMB_OPTIONS, MODULE_PATHS, SITES_ROOT } from '../../content.const';

const useRoutesBreadcrumbs = (
	extraBreadcrumbs: Breadcrumb[] = [],
	extraProps?: Record<string, unknown>
): ReactNode => {
	const { generatePath } = useNavigate(SITES_ROOT);
	const { siteId } = useParams<{ siteId: string }>();
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS,
		extraProps,
		extraBreadcrumbs: [
			{
				name: 'Home',
				target: generatePath(MODULE_PATHS.root, {
					siteId,
				}),
			},
			{
				name: 'Content',
				target: '',
			},
			...extraBreadcrumbs,
		],
	});

	return breadcrumbs;
};

export default useRoutesBreadcrumbs;
