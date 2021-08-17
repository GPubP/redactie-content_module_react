import { ViewFieldProps } from '@redactie/form-renderer-module';
import { DataLoader, useNavigate, useSiteContext } from '@redactie/utils';
import classnames from 'classnames';
import React, { ReactElement, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { MODULE_PATHS, SITES_ROOT } from '../../../content.const';
import { useCcContentItem } from '../../../hooks';
import { ccContentFacade } from '../../../store/ccContent';

const CCContentSelectView: React.FC<ViewFieldProps> = ({ value, fieldSchema }: ViewFieldProps) => {
	const { siteId } = useSiteContext();
	const { generatePath } = useNavigate(SITES_ROOT);
	const [contentItemLoadingState, ccContentItem] = useCcContentItem(value?.content);

	useEffect(() => {
		if (!value?.content) {
			return;
		}
		ccContentFacade.getContentItem(siteId, value.content);
	}, [siteId, value]);

	if (typeof value?.content !== 'string') {
		return null;
	}

	const { text, style } = value;

	const className = classnames('u-margin-bottom', {
		'a-button a-button-primary': style === 'button',
	});

	const renderView = (): ReactElement | null => {
		if (!ccContentItem) {
			return null;
		}

		return (
			<div>
				<Link
					id={`${fieldSchema?.name}-${value}`}
					className={className}
					title={ccContentItem?.meta.label}
					to={generatePath(MODULE_PATHS.detailView, {
						contentId: ccContentItem?.uuid,
						contentTypeId: ccContentItem?.meta?.contentType.uuid,
						siteId,
					})}
					target="_blank"
				>
					{text || ccContentItem?.meta.label}
				</Link>
			</div>
		);
	};

	return (
		<div className="u-margin-bottom">
			<DataLoader
				loadingState={contentItemLoadingState}
				render={renderView}
				notFoundMessage=""
			/>
		</div>
	);
};

export default CCContentSelectView;
