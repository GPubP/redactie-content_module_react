import { SearchParams } from '@redactie/utils';
import moment from 'moment';

import { FilterFormState, PublishedStatuses } from '../../components';
import { DATE_FORMATS } from '../../content.const';
import { ContentExtraFilterStatus } from '../../services/content';

export const getFilterStateFromParams = (query?: SearchParams): FilterFormState => {
	return {
		contentTypes: query?.contentTypes?.length ? query.contentTypes : [],
		lang: query?.lang?.length ? query.lang : [],
		creator: query?.creator ?? '',
		published: query?.published
			? query?.published === 'true' || query?.published === 'false'
				? query?.published === 'true'
					? PublishedStatuses.ONLINE
					: PublishedStatuses.OFFLINE
				: ContentExtraFilterStatus.ALL
			: '',
		lastModifiedFrom: query?.lastModifiedFrom
			? moment(query.lastModifiedFrom).format(DATE_FORMATS.date)
			: '',
		lastModifiedTo: query?.lastModifiedTo
			? moment(query.lastModifiedTo).format(DATE_FORMATS.date)
			: '',
		search: query?.search ?? '',
		status: query?.['latest-status'] ?? '',
	};
};
