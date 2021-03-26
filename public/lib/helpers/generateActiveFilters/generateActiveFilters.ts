import { SelectOption } from '@redactie/utils';

import { ContentTypeSchema } from '../../api/api.types';
import { FilterFormState } from '../../components';
import { OverviewFilterItem } from '../../content.types';
import { FilterKeys } from '../../views/ContentOverview/ContentOverview.types';

export const generateActiveFilters = (
	{
		search,
		contentType,
		publishedFrom,
		publishedTo,
		status,
		published,
		creator,
	}: FilterFormState,
	filterStatusOptions: SelectOption[],
	publishedOptions: SelectOption[],
	contentTypes: ContentTypeSchema[]
): {
	filters: OverviewFilterItem[];
	contentTypeFilters: OverviewFilterItem[];
} => {
	const statusValue = filterStatusOptions.find(option => option.value === status)?.label || '';
	const publishedValue = publishedOptions.find(option => option.value === published)?.label || '';

	const filters: OverviewFilterItem[] = [
		...(search
			? [
					{
						filterKey: FilterKeys.SEARCH,
						valuePrefix: 'Zoekterm',
						value: search,
					},
			  ]
			: []),
		...(publishedFrom && publishedTo
			? [
					{
						filterKey: FilterKeys.DATE,
						valuePrefix: 'Gepubliceerd tussen',
						value: `${publishedFrom} - ${publishedTo}`,
					},
			  ]
			: []),
		...(statusValue
			? [
					{
						filterKey: FilterKeys.STATUS,
						valuePrefix: 'Status',
						value: statusValue,
					},
			  ]
			: []),
		...(publishedValue
			? [
					{
						filterKey: FilterKeys.PUBLISHED,
						valuePrefix: 'Status',
						value: publishedValue,
					},
			  ]
			: []),
		...(creator
			? [
					{
						filterKey: FilterKeys.CREATOR,
						valuePrefix: 'Persoon',
						value: creator,
					},
			  ]
			: []),
	];

	const contentTypeFilters = contentType.map(ctId => ({
		valuePrefix: 'Content type',
		formvalue: ctId,
		filterKey: FilterKeys.CONTENT_TYPE,
		value: contentTypes?.find(ct => ct._id === ctId)?.meta.label || ctId,
	}));

	return {
		filters: filters.concat(contentTypeFilters).filter(item => !!item.value),
		contentTypeFilters,
	};
};