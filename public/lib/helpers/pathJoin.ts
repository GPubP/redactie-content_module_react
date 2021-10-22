export const pathJoin = (parts: string[], separator = '/'): string => {
	const replace = new RegExp(`${separator}{1,}`, 'g');

	return parts.join(separator).replace(replace, separator);
};
