export const useCoreTranslation = (): [(keys: string | string[]) => string] => {
	return [
		(keys: string | string[]) => {
			return (keys as unknown) as string;
		},
	];
};
