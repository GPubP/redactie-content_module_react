import { ContentStatus } from '../../services/content';

import { getLatestStatus } from './getLatestStatus';

describe('getLatestStatus', () => {
	it('should return DRAFT when the latest version is a draft version', () => {
		const latestStatus = getLatestStatus({
			draft: { uuid: '1', isLatestVersion: true, type: ContentStatus.DRAFT },
			pendingReview: { uuid: '2', isLatestVersion: false },
			pendingPublish: { uuid: '3', isLatestVersion: false },
			scheduled: { uuid: '4', isLatestVersion: false },
			scheduledUnpublish: { uuid: '5', isLatestVersion: false },
			published: false,
			lastEdit: new Date().toISOString(),
		});
		expect(latestStatus).toBe(ContentStatus.DRAFT);
	});

	it('should return PENDING_REVIEW when the latest version is a pending review version', () => {
		const latestStatus = getLatestStatus({
			draft: { uuid: '1', isLatestVersion: false },
			pendingReview: { uuid: '2', isLatestVersion: true, type: ContentStatus.PENDING_REVIEW },
			pendingPublish: { uuid: '3', isLatestVersion: false },
			scheduled: { uuid: '4', isLatestVersion: false },
			scheduledUnpublish: { uuid: '5', isLatestVersion: false },
			published: false,
			lastEdit: new Date().toISOString(),
		});
		expect(latestStatus).toBe(ContentStatus.PENDING_REVIEW);
	});

	it('should return PENDING_PUBLISH when the latest version is a pending publish version', () => {
		const latestStatus = getLatestStatus({
			draft: { uuid: '1', isLatestVersion: false },
			pendingReview: { uuid: '2', isLatestVersion: false },
			pendingPublish: {
				uuid: '3',
				isLatestVersion: true,
				type: ContentStatus.PENDING_PUBLISH,
			},
			scheduled: { uuid: '4', isLatestVersion: false },
			scheduledUnpublish: { uuid: '5', isLatestVersion: false },
			published: false,
			lastEdit: new Date().toISOString(),
		});
		expect(latestStatus).toBe(ContentStatus.PENDING_PUBLISH);
	});

	it('should return SCHEDULED when the latest version is a sheduled version', () => {
		const latestStatus = getLatestStatus({
			draft: { uuid: '1', isLatestVersion: false },
			pendingReview: { uuid: '2', isLatestVersion: false },
			pendingPublish: { uuid: '3', isLatestVersion: false },
			scheduled: { uuid: '4', isLatestVersion: true, type: ContentStatus.SCHEDULED },
			scheduledUnpublish: { uuid: '5', isLatestVersion: false },
			published: false,
			lastEdit: new Date().toISOString(),
		});
		expect(latestStatus).toBe(ContentStatus.SCHEDULED);
	});

	it('should return PUBLISHED when the latest version is a published version', () => {
		const latestStatus = getLatestStatus({
			draft: { uuid: '1', isLatestVersion: false },
			pendingReview: { uuid: '2', isLatestVersion: false },
			pendingPublish: { uuid: '3', isLatestVersion: false },
			scheduled: { uuid: '4', isLatestVersion: false },
			scheduledUnpublish: { uuid: '5', isLatestVersion: false },
			published: true,
			lastEdit: new Date().toISOString(),
		});
		expect(latestStatus).toBe(ContentStatus.PUBLISHED);
	});

	it('should return UNPUBLISHED when the latest version is a unpublished version', () => {
		const latestStatus = getLatestStatus({
			draft: { uuid: '1', isLatestVersion: false },
			pendingReview: { uuid: '2', isLatestVersion: false },
			pendingPublish: { uuid: '3', isLatestVersion: false },
			scheduled: { uuid: '4', isLatestVersion: false },
			scheduledUnpublish: { uuid: '5', isLatestVersion: false },
			published: false,
			lastEdit: new Date().toISOString(),
		});
		expect(latestStatus).toBe(ContentStatus.UNPUBLISHED);
	});
});
