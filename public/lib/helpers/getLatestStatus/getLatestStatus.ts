import {
	CONTENT_STATUS_API_MAP,
	ContentHistorySummary,
	ContentHistorySummaryStatus,
	ContentStatus,
	ContentStatusKeys,
} from '../../services/content';

export const getLatestStatus = (
	historySummary: ContentHistorySummary,
	status: string
): ContentStatusKeys => {
	let latestStatus: ContentStatusKeys | undefined;

	Object.values(CONTENT_STATUS_API_MAP).some(statusKey => {
		const status = (historySummary as any)[statusKey] as ContentHistorySummaryStatus;

		if (status && status.isLatestVersion) {
			latestStatus = status.type;
			return true;
		}

		return false;
	});

	if (!latestStatus) {
		return historySummary.published
			? ContentStatus.PUBLISHED
			: status === ContentStatus.UNPUBLISHED
			? ContentStatus.UNPUBLISHED
			: ContentStatus.DRAFT;
	}

	return latestStatus;
};
