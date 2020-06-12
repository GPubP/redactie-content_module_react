import { ModuleRouteConfig } from '@redactie/redactie-core';

export interface RenderChildRoutesProps {
	routes?: ModuleRouteConfig[];
	guardsMeta: Record<string, unknown>;
	extraOptions: Record<string, unknown>;
}
