import { LoadingState } from '@redactie/utils';
import React, { FC, useEffect } from 'react';

import { ContentDetailExternalRouteProps, Tab } from '../../content.types';
import { mapExternalTabToTab } from '../../helpers';
import { useExternalTabsFacade } from '../../store/api/externalTabs/externalTabs.facade';

import {
	ContentDetailExternalMatchProps,
	ExternalStandaloneTabValue,
	ExternalTabValue,
} from './ContentDetailExternal.types';

const ContentDetailExternal: FC<ContentDetailExternalRouteProps<
	ContentDetailExternalMatchProps
>> = ({ contentType, contentItem, contentItemLoading, onCancel, onSubmit, match, workflow }) => {
	const { tab, contentId, siteId } = match.params;

	/**
	 * HOOKS
	 */
	const [{ active: activeTab }, activate] = useExternalTabsFacade();

	useEffect(() => {
		activate(tab);
	}, [tab]); // eslint-disable-line

	/**
	 * METHODS
	 */

	const onExternalTabSubmit = (value: ExternalTabValue): void => {
		if (!activeTab) {
			return;
		}

		onSubmit(value, mapExternalTabToTab(activeTab));
	};

	const getExternalTabValue = (activeTab: Tab): ExternalTabValue | ExternalStandaloneTabValue => {
		if (activeTab.standalone) {
			return {};
		}

		return {};
	};

	/**
	 * RENDER
	 */
	return activeTab ? (
		<activeTab.component
			contentId={contentId}
			siteId={siteId}
			contentType={contentType}
			contentItem={contentItem}
			onSubmit={(values: ExternalTabValue) => onExternalTabSubmit(values)}
			onCancel={() => onCancel()}
			updateContentItem={() => null}
			value={getExternalTabValue(mapExternalTabToTab(activeTab))}
			isLoading={contentItemLoading === LoadingState.Loading}
			workflow={workflow}
		/>
	) : null;
};

export default ContentDetailExternal;
