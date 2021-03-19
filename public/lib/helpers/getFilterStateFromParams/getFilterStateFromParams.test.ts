import { MOCK_FILTER_FORM_STATE } from '../__mocks__';

import { getFilterStateFromParams } from './getFilterStateFromParams';

const MOCK_QUERY_PARAMS = {
	search: 'search',
	['latest-status']: 'active',
};

const MOCK_RESULT = {
	...MOCK_FILTER_FORM_STATE,
	search: MOCK_QUERY_PARAMS.search,
	status: MOCK_QUERY_PARAMS['latest-status'],
};

describe('Helpers: getFilterStateFromParams', () => {
	it('Should return a valid form state based on query params', () => {
		const result = getFilterStateFromParams(MOCK_QUERY_PARAMS);

		expect(result).toEqual(MOCK_RESULT);
	});

	it('Should return a valid form state when no query params are given', () => {
		const emptyResult = getFilterStateFromParams();

		expect(emptyResult).toEqual(MOCK_FILTER_FORM_STATE);
	});
});
