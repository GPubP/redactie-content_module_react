import { ContentStatus } from '../../api/api.types';
import { FilterFormState, PUBLISHED_OPTIONS } from '../../components';
import { OverviewFilterItem } from '../../content.types';
import {
	CONTENT_EXTRA_FILTER_TRANSLATION_MAP,
	CONTENT_STATUS_TRANSLATION_MAP,
	ContentExtraFilterStatus,
} from '../../services/content';
import { FilterKeys } from '../../views/ContentOverview/ContentOverview.types';
import { MOCK_CONTENT_TYPES, MOCK_FILTER_FORM_STATE, MOCK_LANGUAGES } from '../__mocks__';

import { generateActiveFilters } from './generateActiveFilters';

jest.mock('../../components/forms/MetaForm', () => ({}));

const MOCK_CONTENT_TYPE_FILTERS_RESULT = [
	{
		valuePrefix: 'Content type',
		formvalue: MOCK_CONTENT_TYPES[0]._id,
		filterKey: FilterKeys.CONTENT_TYPE,
		value: MOCK_CONTENT_TYPES[0].meta.label,
	},
	{
		valuePrefix: 'Content type',
		formvalue: MOCK_CONTENT_TYPES[2]._id,
		filterKey: FilterKeys.CONTENT_TYPE,
		value: MOCK_CONTENT_TYPES[2].meta.label,
	},
];
const MOCK_FILTER_FORM_VALUES: Partial<FilterFormState> = {
	contentTypes: [MOCK_CONTENT_TYPES[1]._id],
	lastModifiedFrom: '1/1/2021',
	lastModifiedTo: '1/12/2021',
	creator: 'John Doe',
	status: ContentStatus.DRAFT,
};
const MOCK_FILTERS_RESULT: OverviewFilterItem[] = [
	{
		valuePrefix: 'Content type',
		formvalue: MOCK_CONTENT_TYPES[1]._id,
		filterKey: FilterKeys.CONTENT_TYPE,
		value: MOCK_CONTENT_TYPES[1].meta.label,
	},
	{
		valuePrefix: 'Laatst bijgewerkt vanaf',
		filterKey: FilterKeys.DATE,
		value: `${MOCK_FILTER_FORM_VALUES.lastModifiedFrom}`,
	},
	{
		valuePrefix: 'Laatst bijgewerkt tot',
		filterKey: FilterKeys.DATE,
		value: `${MOCK_FILTER_FORM_VALUES.lastModifiedTo}`,
	},
	{
		valuePrefix: 'Persoon',
		filterKey: FilterKeys.CREATOR,
		value: MOCK_FILTER_FORM_VALUES.creator as string,
	},
	{
		valuePrefix: 'Status',
		filterKey: FilterKeys.STATUS,
		value: CONTENT_STATUS_TRANSLATION_MAP.DRAFT,
	},
];

const wrappedGenerateActiveFilters = (
	formState: FilterFormState = MOCK_FILTER_FORM_STATE
): ReturnType<typeof generateActiveFilters> =>
	generateActiveFilters(
		formState,
		[
			{
				value: ContentExtraFilterStatus.ALL,
				label: CONTENT_EXTRA_FILTER_TRANSLATION_MAP.ALL,
			},
			{
				value: ContentStatus.PUBLISHED,
				label: CONTENT_STATUS_TRANSLATION_MAP.PUBLISHED,
			},
			{
				value: ContentStatus.DRAFT,
				label: CONTENT_STATUS_TRANSLATION_MAP.DRAFT,
			},
			{
				value: ContentStatus.SCHEDULED,
				label: CONTENT_STATUS_TRANSLATION_MAP.SCHEDULED,
			},
			{
				value: ContentStatus.PENDING_REVIEW,
				label: CONTENT_STATUS_TRANSLATION_MAP.PENDING_REVIEW,
			},
			{
				value: ContentStatus.PENDING_PUBLISH,
				label: CONTENT_STATUS_TRANSLATION_MAP.PENDING_PUBLISH,
			},
			{
				value: ContentStatus.UNPUBLISHED,
				label: CONTENT_STATUS_TRANSLATION_MAP.UNPUBLISHED,
			},
		],
		PUBLISHED_OPTIONS,
		MOCK_CONTENT_TYPES,
		MOCK_LANGUAGES
	);

describe('Helpers: generateActiveFilters', () => {
	it('Should return active filters', () => {
		const { filters } = wrappedGenerateActiveFilters({
			...MOCK_FILTER_FORM_STATE,
			...MOCK_FILTER_FORM_VALUES,
		});

		const sortFilters = (a: OverviewFilterItem, b: OverviewFilterItem): number =>
			a.filterKey < b.filterKey ? -1 : a.filterKey > b.filterKey ? 1 : 0;
		const sortedFilters = filters.sort(sortFilters);
		const sortedResult = MOCK_FILTERS_RESULT.sort(sortFilters);

		expect(filters).toHaveLength(MOCK_FILTERS_RESULT.length);
		expect(sortedFilters).toEqual(sortedResult);
	});

	it('Should return a list of active content type filters', () => {
		const { contentTypeFilters } = wrappedGenerateActiveFilters({
			...MOCK_FILTER_FORM_STATE,
			contentTypes: [MOCK_CONTENT_TYPES[0]._id, MOCK_CONTENT_TYPES[2]._id],
		});

		expect(contentTypeFilters).toHaveLength(MOCK_CONTENT_TYPE_FILTERS_RESULT.length);
		expect(contentTypeFilters).toEqual(MOCK_CONTENT_TYPE_FILTERS_RESULT);
	});

	it('Should return empty filters with empty filter form values', () => {
		const { filters, contentTypeFilters } = wrappedGenerateActiveFilters();

		expect(filters).toHaveLength(0);
		expect(contentTypeFilters).toHaveLength(0);
	});
});
