import { InputFieldProps } from '@redactie/form-renderer-module';
import { useNavigate, useSiteContext } from '@redactie/utils';
import React, { useMemo, useState } from 'react';
import { first } from 'rxjs/operators';

import './ContentSelect.scss';

import { ContentSelectBase } from '../..';
import { MODULE_PATHS, SITES_ROOT } from '../../../content.const';
import { ccContentFacade } from '../../../store/ccContent';
import { ContentModel } from '../../../store/content';

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
		{ value: string | undefined; label: string; contentTypeId: string }[]
	>([]);
	const [originalItems, setOriginalItems] = useState<ContentModel[]>([]);
	const currentItem = useMemo(() => {
		const item = items.find(i => i.value === field.value);

		return item;
	}, [field.value, items]);

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
					value: c.uuid,
					contentTypeId: c.meta.contentType.uuid,
				}));

				setOriginalItems((content as ContentModel[]) || []);
				setItems(newItems);

				cb(newItems);
			});
	};

	const setValue = (uuid: string): void => {
		if (!config.returnByValue) {
			return fieldHelperProps.setValue(uuid);
		}

		const originalItem = originalItems.find(item => item.uuid === uuid);

		if (originalItem) {
			return fieldHelperProps.setValue(originalItem);
		}

		const item = items.find(item => item.value === uuid);

		if (item) {
			return fieldHelperProps.setValue(item);
		}
	};

	/**
	 * RENDER
	 */
	return (
		<>
			<ContentSelectBase
				fieldSchema={fieldSchema}
				fieldProps={fieldProps}
				items={items}
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
		</>
	);
};

export default ContentSelect;
