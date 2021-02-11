import { alertService } from '@redactie/utils';
import debounce from 'lodash.debounce';

import { ExternalCompartmentAfterSubmitFn } from '../../../api/api.types';
import { contentApiService } from '../../../services/content';
import { contentFacade } from '../../../store/content';
import { getAlertMessages } from '../../../store/content/content.messages';
import {
	contentCompartmentsFacade,
	ContentCompartmentsValidateOptions,
	ResponseError,
} from '../../../store/ui/contentCompartments';

export const BE_ERROR_CODES = {
	INVALID_SLUG: 'slug_0',
};

const queue: ((isValid: boolean) => void)[] = [];
let lastValidatedValue = true;

const runQueue = (partialQueue: ((isValid: boolean) => void)[], isValid: boolean): void => {
	while (partialQueue.length >= 1) {
		const resolver = partialQueue.shift();

		if (resolver) {
			resolver(isValid);
		}
	}
};

const validateSlug = async (
	siteId: string,
	language: string,
	slug: string,
	contentId?: string
): Promise<void> => {
	const payload = { language, slug, ...(contentId ? { id: contentId } : {}) };
	const partialQueue = [...queue];

	try {
		await contentApiService.validateSlug(siteId, payload);
		lastValidatedValue = true;

		runQueue(partialQueue, true);
	} catch (error) {
		lastValidatedValue = false;
		runQueue(partialQueue, false);
	}
};

const debouncedValidation = debounce(validateSlug, 1000);

export const validatieSlugDebouncedWrapper = (
	siteId: string,
	language: string,
	contentId?: string,
	options?: ContentCompartmentsValidateOptions
): ((slug: string) => Promise<boolean>) => (slug: string): Promise<boolean> => {
	if (options && !options.async) {
		return Promise.resolve(lastValidatedValue);
	}

	return new Promise(resolve => {
		queue.push(resolve);
		debouncedValidation(siteId, language, slug, contentId);
	});
};

export const afterSubmitMeta: ExternalCompartmentAfterSubmitFn = async (
	error,
	contentItemDraft,
	ct,
	existingContentItem
) => {
	if (typeof (error as ResponseError)?.response?.json !== 'function') {
		return;
	}

	const body = await (error as ResponseError)?.response?.json();
	const alertProps = getAlertMessages(contentItemDraft);

	contentCompartmentsFacade.setValid('meta', false);

	if (body.code === BE_ERROR_CODES.INVALID_SLUG) {
		alertService.danger(
			existingContentItem ? alertProps.update.errorSlug : alertProps.create.errorSlug,
			existingContentItem
				? contentFacade.alertContainerProps.update
				: contentFacade.alertContainerProps.create
		);
		throw error;
	}
};
