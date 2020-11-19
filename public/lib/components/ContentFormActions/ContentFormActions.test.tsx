import { fireEvent, getNodeText, render } from '@testing-library/react';
import React from 'react';

import { CORE_TRANSLATIONS } from '../../connectors/translations';
import { CONTENT_STATUS_TRANSLATION_MAP, ContentStatus } from '../../services/content';

import ContentFormActions from './ContentFormActions';

jest.mock('../../connectors/translations');

function handleClick(done?: () => void) {
	return () => {
		if (done) {
			done();
		}
	};
}

describe('<ContentFormActions/>', () => {
	describe('Props', () => {
		describe('isSaved prop', () => {
			it('should show a button whith text `Bewaard` when the isSaved prop is true', () => {
				const { getByText, queryByText } = render(<ContentFormActions isSaved={true} />);
				const savedLabelText = 'Bewaard';
				const savedLabel = getByText(savedLabelText);
				const cancelButton = queryByText(CORE_TRANSLATIONS.BUTTON_CANCEL);
				const saveButton = queryByText(CORE_TRANSLATIONS.BUTTON_SAVE);

				expect(getNodeText(savedLabel)).toBe(savedLabelText);
				expect(cancelButton).toBeNull();
				expect(saveButton).toBeNull();
			});

			it('should show a `cancel` and `save` button when the isSaved prop is false', done => {
				const { queryByText, getByText } = render(
					<ContentFormActions
						onSave={handleClick()}
						onCancel={handleClick(done)}
						isSaved={false}
					/>
				);
				const savedLabelText = 'Bewaard';
				const savedLabel = queryByText(savedLabelText);
				const cancelButton = getByText(CORE_TRANSLATIONS.BUTTON_CANCEL);
				const saveButton = getByText(CORE_TRANSLATIONS.BUTTON_SAVE);

				expect(savedLabel).toBeNull();
				expect(cancelButton).toBeDefined();
				expect(saveButton).toBeDefined();
				fireEvent.click(saveButton);
				fireEvent.click(cancelButton);
			});
		});

		describe('status prop', () => {
			it('should show the translation of a given status', done => {
				const status = ContentStatus.DRAFT;
				const { getByText } = render(
					<ContentFormActions onStatusClick={handleClick(done)} status={status} />
				);

				const statusButton = getByText(CONTENT_STATUS_TRANSLATION_MAP.DRAFT);

				expect(statusButton).toBeDefined();
				fireEvent.click(statusButton);
			});

			it('should show a green status button when the status prop has the value `published`', () => {
				const status = ContentStatus.PUBLISHED;
				const { getByText } = render(<ContentFormActions status={status} />);

				const statusButton = getByText(CONTENT_STATUS_TRANSLATION_MAP.PUBLISHED);

				expect(statusButton).toBeDefined();
				expect(statusButton).toHaveClass('a-button--success');
			});
		});

		describe('isPublished prop', () => {
			it('should show the update publication button when the status is equal to DRAFT and the isPublished prop is set to true', done => {
				const status = ContentStatus.DRAFT;
				const { getByText } = render(
					<ContentFormActions
						onUpdatePublication={handleClick(done)}
						status={status}
						isPublished={true}
					/>
				);
				const updatePublicationButtonText = 'Publicatie bijwerken';
				const updatePublicationButton = getByText(updatePublicationButtonText);

				expect(updatePublicationButton).toBeDefined();
				fireEvent.click(updatePublicationButton);
			});
		});

		describe('showPublishedStatus prop', () => {
			it('should show a published status when the showPublishedStatus porp is set to true', () => {
				const { container } = render(
					<ContentFormActions showPublishedStatus={true} isPublished={true} />
				);

				const publishedStatusElement = container.getElementsByClassName('published-status');

				expect(publishedStatusElement[0]).toBeDefined();
			});

			it('should nont show a published status when the showPublishedStatus porp is set to false', () => {
				const { container } = render(
					<ContentFormActions showPublishedStatus={false} isPublished={true} />
				);

				const publishedStatusElement = container.getElementsByClassName('published-status');

				expect(publishedStatusElement[0]).not.toBeDefined();
			});
		});
	});
});
