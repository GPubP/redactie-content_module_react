import { Button } from '@acpaas-ui/react-components';
import React, { FC, useMemo } from 'react';

import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { CONTENT_STATUS_TRANSLATION_MAP, ContentStatus } from '../../services/content';
import { PublishedStatus } from '../PublishedStatus';

import { ContentFormActionsProps } from './ContenFormActions.types';

const ContentFormActions: FC<ContentFormActionsProps> = ({
	contentItem,
	site,
	actions,
	status = ContentStatus.DRAFT,
	isSaved = false,
	isPublished = false,
	isSaving = false,
	isPublishing = false,
	showPublishedStatus = false,
	showDeleteButton = false,
	disableSave = false,
	disableUpdatePublication = false,
	onCancel = () => null,
	onSave = () => null,
	onUpdatePublication = () => null,
	onStatusClick = () => null,
	onDelete = () => null,
}) => {
	/**
	 * Hooks
	 */
	const [t] = translationsConnector.useCoreTranslation();
	const statusButtonType = useMemo(
		() => (status === ContentStatus.PUBLISHED ? 'success' : 'primary'),
		[status]
	);

	return (
		<div className="u-wrapper row end-xs">
			{isSaved && !isSaving ? (
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
						disabled={disableSave || isSaving}
						className="u-margin-right-xs"
						onClick={onSave}
						htmlType="submit"
						type="success"
					>
						{/* TODO: Add to translations */}
						{disableSave ? 'Bewaard' : t(CORE_TRANSLATIONS.BUTTON_SAVE)}
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
			{isPublished && (
				<Button
					iconLeft={isPublishing ? 'circle-o-notch fa-spin' : null}
					disabled={disableUpdatePublication || isPublishing}
					onClick={onUpdatePublication}
					htmlType="submit"
					type="success"
				>
					{/* TODO: Add to translations */}
					Publicatie bijwerken
				</Button>
			)}
			{actions?.map((action, index) => (
				<div className="u-margin-left-xs" key={index}>
					<action.component
						site={site}
						contentItem={contentItem}
						activeLanguage={contentItem?.meta.lang}
					/>
				</div>
			))}
			{showDeleteButton && (
				<Button
					className={!actions || !actions.length ? 'u-margin-left-xs' : ''}
					onClick={onDelete}
					icon="trash-o"
					ariaLabel="Delete"
					// Temporary button is "secondary", because no danger
					type="secondary"
					htmlType="button"
					negative
				/>
			)}
			{showPublishedStatus && <PublishedStatus published={isPublished} />}
		</div>
	);
};

export default ContentFormActions;
