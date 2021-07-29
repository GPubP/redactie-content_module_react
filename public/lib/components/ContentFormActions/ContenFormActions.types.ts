import { SiteDetailModel } from '@redactie/sites-module';

import { ContentModel } from '../../store/content';
import { ContentActionModel } from '../../store/ui/contentActions';

export interface ContentFormActionsProps {
	/**
	 * The current content item
	 */
	contentItem?: ContentModel;
	/**
	 * The current site
	 */
	site?: SiteDetailModel;
	/**
	 * The registered content actions
	 */
	actions?: ContentActionModel[];
	/**
	 * The current status of the content item
	 * Default: DRAFT
	 */
	status?: string;
	/**
	 * True if the current state is saved
	 * Default: false
	 */
	isSaved?: boolean;
	/**
	 * True whent there is a published version
	 * Default: false
	 */
	isPublished?: boolean;
	/**
	 * show loading state on save button
	 */
	isSaving?: boolean;
	/**
	 * Show loading state on publish button
	 */
	isPublishing?: boolean;
	/**
	 * Show published (online/offline) status
	 */
	showPublishedStatus?: boolean;
	/**
	 * Show delete button
	 */
	showDeleteButton?: boolean;
	/**
	 * Callback function onCancel
	 */
	onCancel?: () => void;
	/**
	 * Callback function onSave
	 */
	onSave?: () => void;
	/**
	 * Callback function onUpdatePublication
	 */
	onUpdatePublication?: () => void;
	/**
	 * Callback function onStatusClick
	 */
	onStatusClick?: () => void;
	/**
	 * Callback function onDelete
	 */
	onDelete?: () => void;
}
