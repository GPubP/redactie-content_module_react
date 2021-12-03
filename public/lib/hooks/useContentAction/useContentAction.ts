import { useObservable } from '@redactie/utils';

import {
	ContentActionModel,
	ContentActionRegisterOptions,
	contentActionsFacade,
} from '../../store/ui/contentActions';

interface ActionState {
	actions: ContentActionModel[];
}

const useContentActionFacade = (): [
	ActionState,
	(actions: ContentActionModel[], options: ContentActionRegisterOptions) => void
] => {
	const register = (
		actions: ContentActionModel[] | ContentActionModel,
		options: { replace?: true }
	): void => contentActionsFacade.register(actions, options);
	const actions = useObservable(contentActionsFacade.all$, []);

	return [{ actions }, register];
};

export default useContentActionFacade;
