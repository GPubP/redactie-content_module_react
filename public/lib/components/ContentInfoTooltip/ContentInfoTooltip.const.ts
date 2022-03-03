import { Status } from './ContentInfoTooltip.types';

export const STATUS_TRANSLATION_MAP = {
	[Status.NEW]: 'Nieuw',
	[Status.DRAFT]: 'Werkversie',
	[Status.PUBLISHED]: 'Gepubliceerd',
	[Status.SCHEDULED]: 'In wacht',
	[Status.PENDING_REVIEW]: 'Klaar voor nakijken',
	[Status.PENDING_PUBLISH]: 'Klaar voor publicatie',
	[Status.UNPUBLISHED]: 'Gearchiveerd',
};
