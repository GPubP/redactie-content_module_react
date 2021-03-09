import { Autocomplete } from '@acpaas-ui/react-components';
import { Tooltip } from '@acpaas-ui/react-editorial-components';
import { InputFieldProps } from '@redactie/form-renderer-module';
import { LoadingState, useNavigate, useSiteContext } from '@redactie/utils';
import classNames from 'classnames';
import { getIn } from 'formik';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { first } from 'rxjs/operators';

import './ContentSelect.scss';

import { ErrorMessage } from '../../../connectors/formRenderer';
import { MODULE_PATHS, SITES_ROOT } from '../../../content.const';
import { useCcContent } from '../../../hooks';
import { ccContentFacade } from '../../../store/ccContent';
import { ContentModel } from '../../../store/content';

import { CONTENT_SELECT_TOOLTIP_DELAY, CONTENT_SELECT_TOOLTIP_TYPE } from './ContentSelect.const';

const ContentSelect: React.FC<InputFieldProps> = ({
	fieldProps,
	fieldSchema,
	fieldHelperProps,
}: InputFieldProps) => {
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
	const [contentLoadingState] = useCcContent('search');
	const autoCompleteRef = useRef(null);
	const [isVisible, setVisibility] = useState(false);
	const [isHoveringTooltip, setHoveringTooltip] = useState(false);
	const [delayShowLoop, setDelayShowLoop] = useState<NodeJS.Timeout>();
	const [delayHideLoop, setDelayHideLoop] = useState<NodeJS.Timeout>();
	const [items, setItems] = useState<{ value: string | undefined; label: string }[]>([]);
	const currentItem = useMemo(() => {
		const item = items.find(i => i.value === field.value);

		return item;
	}, [field.value, items]);

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
					onSelection={(selected: string) => {
						fieldHelperProps.setValue(selected);
					}}
					asyncItems={async (query: string, cb: (options: any[]) => void) => {
						await ccContentFacade.getContent(
							'search',
							siteId,
							{
								skip: 0,
								limit: 10,
								search: query,
								...(config.contentTypes?.length
									? { contentTypes: config.contentTypes.join(',') }
									: {}),
							},
							true
						);

						ccContentFacade
							.selectItemValue('search')
							.pipe(first())
							.subscribe(content => {
								const newItems = ((content as ContentModel[]) || []).map(c => ({
									label: `${c.meta.label} [${c.meta.contentType?.meta?.label ||
										''}] - ID ${c.uuid}`,
									value: c.uuid,
								}));
								setItems(newItems);
								cb(newItems);
							});
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
					to={
						currentItem?.value
							? generatePath(MODULE_PATHS.detailView, {
									contentId: currentItem?.value,
									siteId,
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

export default ContentSelect;
