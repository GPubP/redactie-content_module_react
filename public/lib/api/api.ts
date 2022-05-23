/**
 * @module Module API
 */
import { TenantContext as contentTenantContext } from '@redactie/utils';

import { ContentInfoTooltip } from '../components/ContentInfoTooltip';
import { getCTUrlPattern, getViewPropsByCT } from '../helpers';

import { hooks } from './hooks';
import { registerContentDetailAction } from './registerContentDetailAction';
import { registerContentDetailCompartment } from './registerContentDetailCompartment';
import { registerContentDetailTab } from './registerContentDetailTab';
import { store } from './store';

export {
	registerContentDetailCompartment,
	registerContentDetailAction,
	registerContentDetailTab,
	getViewPropsByCT,
	getCTUrlPattern,
	store,
	hooks,
	ContentInfoTooltip,
	contentTenantContext,
};
