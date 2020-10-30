import { Breadcrumb, ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../content.const';
import { useNavigate } from '../../hooks';
import useRoutes from '../useRoutes/useRoutes';

const useRoutesBreadcrumbs = (
	extraBreadcrumbs: Breadcrumb[] = [],
	extraProps?: Record<string, unknown>
): ReactNode => {
	const { generatePath } = useNavigate();
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
			...extraBreadcrumbs,
		],
	});

	return breadcrumbs;
};

export default useRoutesBreadcrumbs;
