import { Autocomplete } from '@acpaas-ui/react-components';
import { Tooltip } from '@acpaas-ui/react-editorial-components';
import { LoadingState, useSiteContext } from '@redactie/utils';
import classNames from 'classnames';
import { getIn } from 'formik';
import debounce from 'lodash.debounce';
import { pathOr } from 'ramda';
import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import './ContentSelectBase.scss';

import { ErrorMessage } from '../../connectors/formRenderer';
import { useCcContent } from '../../hooks';
import { ccContentFacade } from '../../store/ccContent';

import {
	CONTENT_SELECT_TOOLTIP_DELAY,
	CONTENT_SELECT_TOOLTIP_TYPE,
} from './ContentSelectBase.const';
import { ContentSelectBaseProps } from './ContentSelectBase.types';

const ContentSelectBase: React.FC<ContentSelectBaseProps> = ({
	fieldSchema,
	fieldProps,
	to,
	currentItem,
	searchParams,
	getItems,
	setValue,
}: ContentSelectBaseProps) => {
	const config = fieldSchema.config || {};
	const { field, form } = fieldProps;

	const touch = getIn(form.touched, field.name);
	const error = getIn(form.errors, field.name);

	const state = !!error && !!touch ? 'error' : '';

	const fieldClass = classNames('a-input', {
		'is-required': config.required,
	});

	const { siteId } = useSiteContext();
	const [contentLoadingState] = useCcContent(`search_${fieldSchema.name}`);
	const autoCompleteRef = useRef(null);
	const [isVisible, setVisibility] = useState(false);
	const [isHoveringTooltip, setHoveringTooltip] = useState(false);
	const [delayShowLoop, setDelayShowLoop] = useState<NodeJS.Timeout>();
	const [delayHideLoop, setDelayHideLoop] = useState<NodeJS.Timeout>();
	const keyInteraction = useRef<boolean>(false);
	const debouncedGetItems = useCallback(
		debounce(async (query, cb) => {
			await ccContentFacade.getContent(
				`search_${fieldSchema.name}`,
				siteId,
				{
					search: query,
					...searchParams,
				},
				true
			);

			getItems(cb);
		}, 500),
		[searchParams]
	);

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

	const setContentValue = (uuid: string): void => {
		keyInteraction.current = false;

		setValue(uuid);
	};

	/**
	 * RENDER
	 */
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
					defaultValue={field.value}
					showSearchIcon={true}
					disabled={!!config.disabled}
					loading={contentLoadingState === LoadingState.Loading}
					onSelection={setContentValue}
					asyncItems={(query: string, cb: (options: any[]) => void) => {
						if (!keyInteraction.current) {
							query = pathOr(field.value, ['contentId'], field.value) as string;
						}

						debouncedGetItems(query, cb);
					}}
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
					to={to}
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

export default ContentSelectBase;
