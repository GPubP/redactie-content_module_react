export const useCoreTranslation = (): [(keys: string | string[]) => string] => {
	return [
		(keys: string | string[]) => {
			return (keys as unknown) as string;
		},
	];
};

export const CORE_TRANSLATIONS = {
	BUTTON_CANCEL: 'cancel',
	BUTTON_SAVE: 'save',
};

export default {
	api: {
		core: {},
	},
	useCoreTranslation,
};
