import { SearchParams } from '@redactie/utils';
import moment from 'moment';

import { FilterFormState, PublishedStatuses } from '../../components';
import { DATE_FORMATS } from '../../content.const';

export const getFilterStateFromParams = (query?: SearchParams): FilterFormState => {
	return {
		contentType: query?.contentTypes?.length ? query.contentTypes : [],
		creator: query?.creator ?? '',
		published:
			typeof query?.published === 'boolean'
				? query.published
					? PublishedStatuses.ONLINE
					: PublishedStatuses.OFFLINE
				: '',
		publishedFrom: query?.publishedFrom
			? moment(query.publishedFrom).format(DATE_FORMATS.date)
			: '',
		publishedTo: query?.publishedTo ? moment(query.publishedTo).format(DATE_FORMATS.date) : '',
		search: query?.search ?? '',
		status: query?.status ?? '',
	};
};
