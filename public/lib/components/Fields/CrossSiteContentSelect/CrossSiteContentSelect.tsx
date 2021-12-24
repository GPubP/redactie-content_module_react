import { Checkbox } from '@acpaas-ui/react-components';
import { DataLoader, useNavigate, useSiteContext } from '@redactie/utils';
import React, { ReactElement, useMemo, useState } from 'react';
import { first } from 'rxjs/operators';

import { ContentSelectBase } from '../..';
import sitesConnector from '../../../connectors/sites';
import { MODULE_PATHS, SITES_ROOT } from '../../../content.const';
import { ccContentFacade } from '../../../store/ccContent';
import { ContentModel } from '../../../store/content';

import { CrossSiteContentSelectFieldProps } from './CrossSiteContentSelect.types';

const CrossSiteContentSelect: React.FC<CrossSiteContentSelectFieldProps> = ({
	fieldProps,
	fieldSchema,
	fieldHelperProps,
}: CrossSiteContentSelectFieldProps) => {
	const config = fieldSchema.config || {};
	const { field } = fieldProps;

	const { siteId } = useSiteContext();
	const { generatePath } = useNavigate(SITES_ROOT);
	const [items, setItems] = useState<
		{ value: string | undefined; label: string; contentTypeId: string; siteId: string }[]
	>([]);
	const currentItem = useMemo(() => {
		const item = items.find(i => i.value === field.value?.contentId);

		return item;
	}, [field.value, items]);
	const { pagination, loading: sitesLoading } = sitesConnector.hooks.usePaginatedSites({
		page: 1,
		pagesize: -1,
	});

	const renderSearchInCurrentSite = useMemo(
		() => config.sites?.length !== 1 && config.sites?.includes(siteId),
		[config.sites, siteId]
	);
	const [searchInCurrentSite, setSearchInCurrentSite] = useState<boolean>(
		(field.value && !field.value?.isCrossSite) || false
	);

	/**
	 * METHODS
	 */

	const setValue = (uuid: string): void => {
		const item = items.find(item => item.value === uuid);

		if (item) {
			return fieldHelperProps.setValue({
				siteId: item.siteId,
				contentId: item.value,
				isCrossSite: !searchInCurrentSite,
			});
		}
	};

	const getItems = async (cb: (options: any[]) => void): Promise<void> => {
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

	const searchInSite = (): void => {
		setSearchInCurrentSite(!searchInCurrentSite);
	};

	/**
	 * RENDER
	 */

	const renderSelect = (): ReactElement => {
		return (
			<>
				<ContentSelectBase
					fieldSchema={fieldSchema}
					fieldProps={fieldProps}
					setValue={setValue}
					getItems={getItems}
					currentItem={currentItem}
					searchParams={{
						skip: 0,
						limit: 10,
						sparse: true,
						...(config.contentTypes?.length
							? { contentTypes: config.contentTypes.join(',') }
							: {}),
						...(config.sites?.length
							? { sites: config.sites.join(',') }
							: { sites: 'all' }),
						...(searchInCurrentSite ? { sites: siteId } : {}),
					}}
					to={
						currentItem?.value
							? generatePath(MODULE_PATHS.detailView, {
									contentId: currentItem?.value,
									contentTypeId: currentItem?.contentTypeId,
									siteId: currentItem?.siteId,
							  })
							: '#'
					}
				/>
				{renderSearchInCurrentSite && (
					<div className="u-margin-top">
						<Checkbox
							id="searchInCurrentSite"
							name="searchInCurrentSite"
							label="Zoek in huidige site"
							checked={searchInCurrentSite}
							onChange={searchInSite}
						/>
					</div>
				)}
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
