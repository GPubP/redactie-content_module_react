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

	onCancel?: () => void;
	onSave?: () => void;
	onUpdatePublication?: () => void;
	onStatusClick?: () => void;
}
