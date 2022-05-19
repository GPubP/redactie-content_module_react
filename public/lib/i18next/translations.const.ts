import { I18NextTranslations } from '@redactie/translations-module';

import translationsConnector from '../connectors/translations';

const tKey = translationsConnector.core.tKey;

const MODULE_TRANSLATIONS = Object.freeze<I18NextTranslations>({
	ISSUED_ON_HINT_ENABLED: tKey(
		'ISSUED_ON_HINT_ENABLED',
		'De uitgiftedatum kan je naar keuze instellen, ook in het verleden.'
	),
	ISSUED_ON_HINT_DISABLED_FIRST_PUBLISH: tKey(
		'ISSUED_ON_HINT_DISABLED_FIRST_PUBLISH',
		'De uitgiftedatum is automatisch ingesteld op de datum van de eerste publicatie.'
	),
	ISSUED_ON_HINT_DISABLED_LAST_PUBLISH: tKey(
		'ISSUED_ON_HINT_DISABLED_LAST_PUBLISH',
		'De uitgiftedatum is automatisch ingesteld op de datum van de laatste publicatie.'
	),
});

export { MODULE_TRANSLATIONS };
