import { PATTERN_REPLACE_TYPES, replacerRegex } from './applyUrlPattern.const';
import { PatternValues } from './applyUrlPattern.types';

export const applyUrlPattern = (pattern: string, patternValues: PatternValues): string => {
	return pattern.replaceAll(replacerRegex, (match: string, captureGroup1) => {
		const [type, prop] = captureGroup1.split(':');

		if (type.toLowerCase() === PATTERN_REPLACE_TYPES.ITEM) {
			return `/${patternValues[prop]}`;
		}

		return match;
	});
};
