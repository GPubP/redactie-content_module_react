import { LanguageSchema } from '@redactie/language-module';
import { SelectOption } from '@redactie/utils';

import { ContentTypeSchema } from '../../api/api.types';
import { FilterFormState } from '../../components';
import { OverviewFilterItem } from '../../content.types';
import { FilterKeys } from '../../views/ContentOverview/ContentOverview.types';

export const generateActiveFilters = (
	{
		search,
		contentTypes,
		lastModifiedFrom,
		lastModifiedTo,
		status,
		published,
		creator,
		lang,
	}: FilterFormState,
	filterStatusOptions: SelectOption[],
	publishedOptions: SelectOption[],
	cts: ContentTypeSchema[],
	languages: LanguageSchema[]
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
		...(lastModifiedFrom
			? [
					{
						filterKey: FilterKeys.DATE,
						valuePrefix: 'Laatst bijgewerkt vanaf',
						value: lastModifiedFrom,
					},
			  ]
			: []),
		...(lastModifiedTo
			? [
					{
						filterKey: FilterKeys.DATE,
						valuePrefix: 'Laatst bijgewerkt tot',
						value: lastModifiedTo,
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

	const contentTypeFilters = contentTypes.map(ctId => ({
		valuePrefix: 'Content type',
		formvalue: ctId,
		filterKey: FilterKeys.CONTENT_TYPE,
		value: cts?.find(ct => ct._id === ctId)?.meta.label || ctId,
	}));

	const langFilters = lang.map(languageKey => ({
		valuePrefix: 'Taal',
		formvalue: languageKey,
		filterKey: FilterKeys.LANGUAGE,
		value: languages.find(language => language.key === languageKey)?.name || languageKey,
	}));

	return {
		filters: [...filters, ...contentTypeFilters, ...langFilters].filter(item => !!item.value),
		contentTypeFilters,
	};
};
