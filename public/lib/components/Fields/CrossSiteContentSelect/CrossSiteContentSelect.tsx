import { Autocomplete } from '@acpaas-ui/react-components';
import { Tooltip } from '@acpaas-ui/react-editorial-components';
import { DataLoader, LoadingState, useNavigate, useSiteContext } from '@redactie/utils';
import classNames from 'classnames';
import { getIn } from 'formik';
import React, { ReactElement, useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { first } from 'rxjs/operators';

import './CrossSiteContentSelect.scss';

import { ErrorMessage } from '../../../connectors/formRenderer';
import sitesConnector from '../../../connectors/sites';
import { MODULE_PATHS, SITES_ROOT } from '../../../content.const';
import { useCcContent } from '../../../hooks';
import { ccContentFacade } from '../../../store/ccContent';
import { ContentModel } from '../../../store/content';

import {
	CONTENT_SELECT_TOOLTIP_DELAY,
	CONTENT_SELECT_TOOLTIP_TYPE,
} from './CrossSiteContentSelect.const';
import { CrossSiteContentSelectFieldProps } from './CrossSiteContentSelect.types';

const CrossSiteContentSelect: React.FC<CrossSiteContentSelectFieldProps> = ({
	fieldProps,
	fieldSchema,
	fieldHelperProps,
}: CrossSiteContentSelectFieldProps) => {
	const config = fieldSchema.config || {};
	const { field, form } = fieldProps;

	const touch = getIn(form.touched, field.name);
	const error = getIn(form.errors, field.name);

	const state = !!error && !!touch ? 'error' : '';

	const fieldClass = classNames('a-input', {
		'is-required': config.required,
	});

	const { siteId } = useSiteContext();
	const { generatePath } = useNavigate(SITES_ROOT);
	const [contentLoadingState] = useCcContent(`search_${fieldSchema.name}`);
	const autoCompleteRef = useRef(null);
	const [isVisible, setVisibility] = useState(false);
	const [isHoveringTooltip, setHoveringTooltip] = useState(false);
	const [delayShowLoop, setDelayShowLoop] = useState<NodeJS.Timeout>();
	const [delayHideLoop, setDelayHideLoop] = useState<NodeJS.Timeout>();
	const keyInteraction = useRef<boolean>(false);
	const [items, setItems] = useState<
		{ value: string | undefined; label: string; contentTypeId: string; siteId: string }[]
	>([]);
	const currentItem = useMemo(() => {
		const item = items.find(i => i.value === field.value.contentId);

		return item;
	}, [field.value, items]);
	const { pagination, loading: sitesLoading } = sitesConnector.hooks.usePaginatedSites({
		page: 1,
		pagesize: -1,
	});

	/**
	 * METHODS
	 */

	const handleMouseEnter = (): void => {
		if (delayHideLoop) {
			clearTimeout(delayHideLoop);
		}
		setDelayShowLoop(
			setTimeout(() => {
				setVisibility(true);
			}, CONTENT_SELECT_TOOLTIP_DELAY)
		);
	};

	const handleMouseLeave = useCallback(() => {
		if (delayShowLoop) {
			clearTimeout(delayShowLoop);
		}
		setDelayHideLoop(
			setTimeout(() => {
				!isHoveringTooltip && setVisibility(false);
			}, CONTENT_SELECT_TOOLTIP_DELAY)
		);
	}, [delayShowLoop, isHoveringTooltip]);

	const handleTooltipMouseEnter = (): void => {
		if (isHoveringTooltip) return;

		setHoveringTooltip(true);
	};

	const handleTooltipMouseLeave = (): void => {
		setDelayHideLoop(
			setTimeout(() => {
				setVisibility(false);
				setHoveringTooltip(false);
			}, CONTENT_SELECT_TOOLTIP_DELAY)
		);
	};

	const handleKeyDown = (): void => {
		keyInteraction.current = true;
	};

	const setValue = (uuid: string): void => {
		keyInteraction.current = false;

		const item = items.find(item => item.value === uuid);

		if (item) {
			return fieldHelperProps.setValue({
				siteId: item.siteId,
				contentId: item.value,
				isCrossSite: item.siteId !== siteId,
			});
		}
	};

	const getItems = async (query: string, cb: (options: any[]) => void): Promise<void> => {
		if (!keyInteraction.current) {
			query = field.value.contentId;
		}

		await ccContentFacade.getContent(
			`search_${fieldSchema.name}`,
			siteId,
			{
				skip: 0,
				limit: 10,
				search: query,
				sparse: true,
				...(config.contentTypes?.length
					? { contentTypes: config.contentTypes.join(',') }
					: {}),
				...(config.sites?.length ? { sites: config.sites.join(',') } : {}),
			},
			true
		);

		ccContentFacade
			.selectItemValue(`search_${fieldSchema.name}`)
			.pipe(first())
			.subscribe(content => {
				const newItems = ((content as ContentModel[]) || []).map(c => ({
					label: `${c.meta.label} [${c.meta.contentType?.meta?.label || ''}] - SITE ${
						pagination?.data.find(site => site.uuid === c.meta.site)?.data.name
					}`,
					value: c.uuid,
					siteId: c.meta.site,
					contentTypeId: c.meta.contentType.uuid,
				}));

				setItems(newItems);

				cb(newItems);
			});
	};

	/**
	 * RENDER
	 */

	const renderSelect = (): ReactElement => {
		return (
			<>
				<div
					ref={autoCompleteRef}
					className={fieldClass}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onKeyDown={handleKeyDown}
				>
					<Autocomplete
						ref={autoCompleteRef}
						label={fieldSchema.label}
						id={fieldSchema.name}
						state={state}
						multipleSelect={false}
						defaultValue={field.value?.contentId}
						showSearchIcon={true}
						disabled={!!config.disabled}
						loading={contentLoadingState === LoadingState.Loading}
						onSelection={setValue}
						asyncItems={getItems}
					/>
				</div>
				<Tooltip
					type={CONTENT_SELECT_TOOLTIP_TYPE}
					isVisible={!!currentItem?.label && (isVisible || isHoveringTooltip)}
					targetRef={autoCompleteRef}
				>
					<Link
						id={currentItem?.value}
						title={currentItem?.label}
						to={
							currentItem?.value
								? generatePath(MODULE_PATHS.detailView, {
										contentId: currentItem?.value,
										contentTypeId: currentItem?.contentTypeId,
										siteId: currentItem?.siteId,
								  })
								: '#'
						}
						target="_blank"
						onMouseEnter={handleTooltipMouseEnter}
						onMouseLeave={handleTooltipMouseLeave}
					>
						{currentItem?.label}
					</Link>
				</Tooltip>
				{config.description ? (
					<div className="a-input a-input__wrapper">
						<small>{config.description}</small>
					</div>
				) : null}
				<ErrorMessage name={field.name} />
			</>
		);
	};
	return (
		<>
			<DataLoader loadingState={sitesLoading} render={renderSelect} />
		</>
	);
};

export default CrossSiteContentSelect;
