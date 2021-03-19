import {
	ContentHistorySummary,
	ContentHistorySummaryStatus,
	ContentStatus,
	ContentStatusKeys,
} from '../../services/content';

import { STATUS_KEYS } from './getLatestStatus.const';

export const getLatestStatus = (historySummary: ContentHistorySummary): ContentStatusKeys => {
	let latestStatus: ContentStatusKeys | undefined;

	STATUS_KEYS.some(statusKey => {
		const status = (historySummary as any)[statusKey] as ContentHistorySummaryStatus;
		if (status.isLatestVersion) {
			latestStatus = status.type;
			return true;
		}
		return false;
	});

	if (!latestStatus) {
		return historySummary.published ? ContentStatus.PUBLISHED : ContentStatus.UNPUBLISHED;
	}

	return latestStatus;
};
