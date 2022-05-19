import { I18NextTranslations } from '@redactie/translations-module';

import translationsConnector from '../connectors/translations';

const tKey = translationsConnector.core.tKey;

const MODULE_TRANSLATIONS = Object.freeze<I18NextTranslations>({
	ISSUED_ON_HINT_ENABLED: tKey(
		'ISSUED_ON_HINT_ENABLED',
		'De uitgiftedatum kan je naar keuze instellen, ook in het verleden.'
	),
	ISSUED_ON_HINT_DISABLED: tKey(
		'ISSUED_ON_HINT_DISABLED',
		'De uitgiftedatum is automatisch ingesteld op de datum eerste|laatste publicatie.'
	),
});

export { MODULE_TRANSLATIONS };
