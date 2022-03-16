import { InputFieldProps } from '@redactie/form-renderer-module';
import { useNavigate, useSiteContext } from '@redactie/utils';
import React, { useMemo, useState } from 'react';
import { first } from 'rxjs/operators';

import { ContentSelectBase } from '../..';
import { ContentInfoTooltip } from '../../../components/ContentInfoTooltip';
import { MODULE_PATHS, SITES_ROOT } from '../../../content.const';
import { ContentMeta } from '../../../services/content/content.service.types';
import { ccContentFacade } from '../../../store/ccContent';
import { ContentModel } from '../../../store/content';
import './ContentSelect.scss';

const ContentSelect: React.FC<InputFieldProps> = ({
	fieldProps,
	fieldSchema,
	fieldHelperProps,
}: InputFieldProps) => {
	const config = fieldSchema.config || {};
	const { field } = fieldProps;

	const { siteId } = useSiteContext();
	const { generatePath } = useNavigate(SITES_ROOT);
	const [items, setItems] = useState<
		{ value: string | undefined; label: string; contentTypeId: string; meta: ContentMeta }[]
	>([]);
	const [originalItems, setOriginalItems] = useState<ContentModel[]>([]);
	const currentItem = useMemo(() => {
		const item = items.find(i => i.value === field.value);

		return item;
	}, [field.value, items]);
	const itemId = currentItem?.label?.substring(currentItem?.label?.indexOf('ID') + 3);

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
					value: config.bySlug ? c.meta.slug.nl : c.uuid,
					contentTypeId: c.meta.contentType.uuid,
					meta: c.meta,
				}));

				setOriginalItems((content as ContentModel[]) || []);
				setItems(newItems);

				cb(newItems);
			});
	};

	const setValue = (identifier: string): void => {
		if (!config.returnByValue) {
			return fieldHelperProps.setValue(identifier);
		}

		const originalItem = originalItems.find(item =>
			config.bySlug ? item.meta.slug.nl === identifier : item.uuid === identifier
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
			<div className="col-xs-8 col-md-11">
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
						...(config.contentTypes?.length
							? { contentTypes: config.contentTypes.join(',') }
							: {}),
					}}
					to={
						currentItem?.value
							? generatePath(MODULE_PATHS.detailView, {
									contentId: currentItem?.value,
									contentTypeId: currentItem?.contentTypeId,
									siteId,
							  })
							: '#'
					}
				/>
			</div>
			{console.info(itemId)}

			{currentItem && <ContentInfoTooltip icon="file-text-o" contentId={itemId} />}
		</div>
	);
};

export default ContentSelect;
