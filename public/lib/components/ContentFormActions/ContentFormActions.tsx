import { Button } from '@acpaas-ui/react-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React, { FC, useMemo } from 'react';

import { useCoreTranslation } from '../../connectors/translations';
import { CONTENT_STATUS_TRANSLATION_MAP, ContentStatus } from '../../services/content';
import { PublishedStatus } from '../PublishedStatus';

import { ContentFormActionsProps } from './ContenFormActions.types';

const ContentFormActions: FC<ContentFormActionsProps> = ({
	status = ContentStatus.DRAFT,
	isSaved = false,
	isPublished = false,
	isSaving = false,
	isPublishing = false,
	showPublishedStatus = false,
	onCancel = () => null,
	onSave = () => null,
	onUpdatePublication = () => null,
	onStatusClick = () => null,
}) => {
	/**
	 * Hooks
	 */
	const [t] = useCoreTranslation();
	const showUpdatePublicationButton = useMemo(() => {
		return status === ContentStatus.DRAFT && isPublished;
	}, [isPublished, status]);
	const statusButtonType = useMemo(
		() => (status === ContentStatus.PUBLISHED ? 'success' : 'primary'),
		[status]
	);

	return (
		<div className="u-wrapper row end-xs">
			{isSaved ? (
				<Button className="u-margin-right-xs" disabled>
					{/* TODO: Add to translations */}
					Bewaard
				</Button>
			) : (
				<>
					<Button
						className="u-margin-right-xs"
						onClick={onCancel}
						type="primary"
						negative
					>
						{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
					</Button>
					<Button
						iconLeft={isSaving ? 'circle-o-notch fa-spin' : null}
						disabled={isSaving}
						className="u-margin-right-xs"
						onClick={onSave}
						htmlType="submit"
						type="success"
					>
						{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
					</Button>
				</>
			)}

			{status && (
				<Button
					className="u-margin-right-xs"
					onClick={onStatusClick}
					type={statusButtonType}
					outline
				>
					{CONTENT_STATUS_TRANSLATION_MAP[status as ContentStatus]}
				</Button>
			)}
			{showUpdatePublicationButton && (
				<Button
					iconLeft={isPublishing ? 'circle-o-notch fa-spin' : null}
					disabled={isPublishing}
					onClick={onUpdatePublication}
					htmlType="submit"
					type="success"
				>
					{/* TODO: Add to translations */}
					Publicatie bijwerken
				</Button>
			)}
			{showPublishedStatus && <PublishedStatus published={isPublished} />}
		</div>
	);
};

export default ContentFormActions;
