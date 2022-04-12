import { Checkbox } from '@acpaas-ui/react-components';
import { DataLoader, useNavigate, useSiteContext } from '@redactie/utils';
import { FieldProps, FormikValues } from 'formik';
import React, { ReactElement, useMemo, useState } from 'react';
import { first } from 'rxjs/operators';

import { ContentInfoTooltip, ContentSelectBase } from '../..';
import sitesConnector from '../../../connectors/sites';
import { MODULE_PATHS, SITES_ROOT } from '../../../content.const';
import { ccContentFacade } from '../../../store/ccContent';
import { ContentModel } from '../../../store/content';
import { ContentSelectItem } from '../../ContentSelectBase/ContentSelectBase.types';

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
	const [items, setItems] = useState<ContentSelectItem[]>([]);
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
	const currentSite = useMemo(
		() => (pagination?.data || []).find(site => site.uuid === currentItem?.siteId),
		[currentItem, pagination]
	);

	/**
	 * METHODS
	 */
	const getItems = async (cb: (options: any[]) => void): Promise<void> => {
		ccContentFacade
			.selectItemValue(`search_${fieldSchema.name}.contentId`)
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

	const setValue = (identifier: string): void => {
		const item = items.find(item => item.value === identifier);

		if (item) {
			return fieldHelperProps.setValue({
				siteId: item.siteId,
				contentId: item.value,
				isCrossSite: !searchInCurrentSite,
			});
		}
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
				<div className="row">
					<div className="col-xs-10 col-md-11">
						<ContentSelectBase
							fieldSchema={{
								...fieldSchema,
								name: `${fieldSchema.name}.contentId`,
							}}
							fieldProps={
								({
									...fieldProps,
									field: {
										...field,
										value: field.value.contentId,
									},
									setValue: setValue,
								} as unknown) as FieldProps<string, FormikValues>
							}
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
					</div>
					{currentItem && (
						<ContentInfoTooltip
							icon="file-text-o"
							className={
								fieldSchema?.label === 'Link'
									? 'm-dataloader-container__link'
									: 'm-dataloader-container__content-item'
							}
							contentId={currentItem?.value}
							site={currentSite}
						/>
					)}
				</div>
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
