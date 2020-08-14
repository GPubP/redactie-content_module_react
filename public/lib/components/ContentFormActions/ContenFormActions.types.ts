export interface ContentFormActionsProps {
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
}
