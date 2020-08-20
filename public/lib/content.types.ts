import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { NavLinkProps } from 'react-router-dom';

export interface ContentRouteProps<
	Params extends {
		[K in keyof Params]?: string;
	} = {}
> extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export enum LoadingState {
	Loading = 'loading',
	Loaded = 'loaded',
	Error = 'error',
}

export interface FilterItemSchema {
	key?: string;
	value: string;
	valuePrefix?: string;
	filterKey: string;
	formvalue?: any;
}

export interface Tab {
	id?: string;
	name: string;
	target: string;
	active: boolean;
	disabled?: boolean;
}

export interface FilterItemsSchema {
	data: FilterItemSchema[];
}

export interface ContextHeaderBadge {
	name: string;
	type: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export interface NavListItem extends NavLinkProps {
	description?: string;
	label: string;
	hasError?: boolean;
}
