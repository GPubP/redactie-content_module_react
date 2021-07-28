import { ExternalActionOptions, externalActionsFacade } from '../store/api/externalActions';

export const registerContentDetailAction = (name: string, options: ExternalActionOptions): void =>
	externalActionsFacade.registerAction(name, options);
