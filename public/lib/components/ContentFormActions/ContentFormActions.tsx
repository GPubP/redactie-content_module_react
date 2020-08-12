import { Button } from '@acpaas-ui/react-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React, { FC, useMemo } from 'react';

import { useCoreTranslation } from '../../connectors/translations';
import { CONTENT_STATUS_TRANSLATION_MAP, ContentStatus } from '../../services/content';

import { ContentFormActionsProps } from './ContenFormActions.types';

const ContentFormActions: FC<ContentFormActionsProps> = ({
	status = ContentStatus.DRAFT,
	isSaved = false,
	isPublished = false,
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
					type="primary"
					outline
				>
					{CONTENT_STATUS_TRANSLATION_MAP[status as ContentStatus]}
				</Button>
			)}
			{showUpdatePublicationButton && (
				<Button onClick={onUpdatePublication} htmlType="submit" type="success">
					{/* TODO: Add to translations */}
					Publicatie bijwerken
				</Button>
			)}
		</div>
	);
};

export default ContentFormActions;
