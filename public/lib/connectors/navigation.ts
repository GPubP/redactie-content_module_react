import Core from '@redactie/redactie-core';
import { first } from 'rxjs/operators';
import { NavigationAPI } from '@redactie/navigation-module';

class NavigationConnector {
	public apiName = 'navigation-module';
	private _api: NavigationAPI | undefined;

	public initialized$ = Core.modules
		.selectModuleAPI<NavigationAPI>(this.apiName)
		.pipe(first());

	public get api() {
		if (!this._api) {
			this._api = Core.modules.getModuleAPI<NavigationAPI>(this.apiName);
		}

		return this._api;
	}
}

const navigationConnector = new NavigationConnector();

export default navigationConnector;
