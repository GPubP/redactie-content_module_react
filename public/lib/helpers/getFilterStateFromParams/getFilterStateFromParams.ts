import { SearchParams } from '@redactie/utils';
import moment from 'moment';

import { FilterFormState, PublishedStatuses } from '../../components';
import { DATE_FORMATS } from '../../content.const';
import { ContentExtraFilterStatus } from '../../services/content';

export const getFilterStateFromParams = (query?: SearchParams): FilterFormState => {
	return {
		contentType: query?.contentTypes?.length ? query.contentTypes : [],
		creator: query?.creator ?? '',
		published: query?.published
			? query?.published === 'true' || query?.published === 'false'
				? query?.published === 'true'
					? PublishedStatuses.ONLINE
					: PublishedStatuses.OFFLINE
				: ContentExtraFilterStatus.ALL
			: '',
		publishedFrom: query?.publishedFrom
			? moment(query.publishedFrom).format(DATE_FORMATS.date)
			: '',
		publishedTo: query?.publishedTo ? moment(query.publishedTo).format(DATE_FORMATS.date) : '',
		search: query?.search ?? '',
		status: query?.['latest-status'] ?? '',
	};
};
