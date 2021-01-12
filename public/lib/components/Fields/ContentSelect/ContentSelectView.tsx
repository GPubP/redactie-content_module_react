import { ViewFieldProps } from '@redactie/form-renderer-module';
import { useSiteContext } from '@redactie/utils';
import React, { ReactElement, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './ContentSelect.scss';

import { MODULE_PATHS } from '../../../content.const';
import { useCcContentItem, useNavigate } from '../../../hooks';
import { ccContentFacade } from '../../../store/ccContent';
import { DataLoader } from '../../DataLoader';

const ContentSelectView: React.FC<ViewFieldProps> = ({ value, fieldSchema }: ViewFieldProps) => {
	const { siteId } = useSiteContext();
	const { generatePath } = useNavigate();
	const [contentItemLoadingState, ccContentItem] = useCcContentItem(value);

	useEffect(() => {
		if (!value) {
			return;
		}
		ccContentFacade.getContentItem(siteId, value);
	}, [siteId, value]);

	if (!value || typeof value !== 'string') {
		return null;
	}

	const renderView = (): ReactElement | null => {
		if (!ccContentItem) {
			return null;
		}

		return (
			<div>
				<Link
					id={`${fieldSchema?.name}-${value}`}
					className="u-margin-bottom a-button a-button-primary has-icon-right"
					title={ccContentItem?.meta.label}
					to={generatePath(MODULE_PATHS.detailView, {
						contentId: ccContentItem?.uuid,
						siteId,
					})}
				>
					<span className="fa fa-chevron-right" />
					{ccContentItem?.meta.label}
				</Link>
			</div>
		);
	};

	return (
		<DataLoader loadingState={contentItemLoadingState} render={renderView} notFoundMessage="" />
	);
};

export default ContentSelectView;
