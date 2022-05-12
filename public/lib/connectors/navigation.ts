import Core from '@redactie/redactie-core';
import { first } from 'rxjs/operators';

class NavigationConnector {
	public apiName = 'navigation-module';
	private _api: any;

	public initialized$ = Core.modules
		.selectModuleAPI<any>(this.apiName)
		.pipe(first());

	public get api() {
		if (!this._api) {
			this._api = Core.modules.getModuleAPI<any>(this.apiName);
		}

		return this._api;
	}
}

const navigationConnector = new NavigationConnector();

export default navigationConnector;
