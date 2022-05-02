import { useNavigate, useSiteContext } from '@redactie/utils';
import React, { useContext, useMemo, useState } from 'react';
import { first } from 'rxjs/operators';

import { ContentInfoTooltip } from '../../../components/ContentInfoTooltip';
import formRendererConnector from '../../../connectors/formRenderer';
import sitesConnector from '../../../connectors/sites';
import { MODULE_PATHS, SITES_ROOT } from '../../../content.const';
import { ccContentFacade } from '../../../store/ccContent';
import { ContentModel } from '../../../store/content';
import { ContentSelectItem } from '../../ContentSelectBase/ContentSelectBase.types';
import { ContentSelectBase } from '../../index';

import { ContentSelectProps } from './ContentSelect.types';

const ContentSelect: React.FC<ContentSelectProps> = ({
	fieldProps,
	fieldSchema,
	fieldHelperProps,
}: ContentSelectProps) => {
	const config = fieldSchema.config || {};
	const { field } = fieldProps;

	const { activeLanguage } = useContext(formRendererConnector.api.FormContext);
	const { siteId } = useSiteContext();
	const [site] = sitesConnector.hooks.useSite(siteId);
	const { generatePath } = useNavigate(SITES_ROOT);
	const [items, setItems] = useState<ContentSelectItem[]>([]);
	const [originalItems, setOriginalItems] = useState<ContentModel[]>([]);
	const [valueSetted, setValueSetted] = useState<boolean>(false);
	const currentItem = useMemo(() => {
		const item = items.find(i => i.value === field.value);

		if (item && !valueSetted && !!fieldHelperProps.setInitialValue) {
			fieldHelperProps.setInitialValue(
				originalItems.find(originalItem => originalItem.uuid === item.uuid) as ContentModel
			);
			setValueSetted(true);
		}

		return item;
	}, [field.value, fieldHelperProps, items, originalItems, valueSetted]);

	/**
	 * METHODS
	 */
	const getItems = async (cb: (options: any[]) => void): Promise<void> => {
		ccContentFacade
			.selectItemValue(`search_${fieldSchema.name}`)
			.pipe(first())
			.subscribe(content => {
				const newItems = ((content as ContentModel[]) || []).map(c => ({
					label: `${c.meta.label} [${c.meta.contentType?.meta?.label || ''}] - ID ${
						c.uuid
					}`,
					value: config.bySlug ? c.meta.slug[c.meta.lang] : c.uuid,
					contentTypeId: c.meta.contentType.uuid,
					uuid: c.uuid || '',
				}));

				setOriginalItems((content as ContentModel[]) || []);
				setItems(newItems);

				cb(newItems);
			});
	};

	const setValue = (identifier: string): void => {
		setValueSetted(true);

		if (!config.returnByValue) {
			return fieldHelperProps.setValue(identifier);
		}

		const originalItem = originalItems.find(item =>
			config.bySlug ? item.meta.slug[item.meta.lang] === identifier : item.uuid === identifier
		);

		if (originalItem) {
			return fieldHelperProps.setValue(originalItem);
		}

		const item = items.find(item => item.value === identifier);

		if (item) {
			return fieldHelperProps.setValue(item);
		}
	};

	/**
	 * RENDER
	 */
	return (
		<div className="row">
			<div className="col-xs-10 col-md-11">
				<ContentSelectBase
					fieldSchema={fieldSchema}
					fieldProps={fieldProps}
					getItems={getItems}
					currentItem={currentItem}
					setValue={setValue}
					searchParams={{
						skip: 0,
						limit: 10,
						sparse: true,
						...(config.allowDifferentLanguageReference !== 'true' && activeLanguage
							? {
									lang: activeLanguage,
							  }
							: {}),
						...(config.contentTypes?.length
							? { contentTypes: config.contentTypes.join(',') }
							: {}),
					}}
					to={
						currentItem?.value
							? generatePath(MODULE_PATHS.detailView, {
									contentId: currentItem?.uuid,
									contentTypeId: currentItem?.contentTypeId,
									siteId,
							  })
							: '#'
					}
				/>
			</div>
			{currentItem && (
				<ContentInfoTooltip
					icon="file-text-o"
					className={
						fieldSchema?.label === 'Link'
							? 'm-dataloader-container__link'
							: 'm-dataloader-container__content-item'
					}
					contentId={currentItem?.uuid}
					site={site}
				/>
			)}
		</div>
	);
};

export default ContentSelect;
