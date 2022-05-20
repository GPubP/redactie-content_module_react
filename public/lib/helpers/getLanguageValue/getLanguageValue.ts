export const getLanguageValue = <T = any>(
	value: T | Record<string, T | boolean>,
	language?: string
): T => {
	if (
		language &&
		typeof value === 'object' &&
		(value as Record<string, T | boolean>)?.multiLanguage
	) {
		return (value as Record<string, T>)[language];
	}

	return value as T;
};
