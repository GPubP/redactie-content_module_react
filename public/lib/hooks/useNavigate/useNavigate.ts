import * as H from 'history';
import { useContext } from 'react';
import { generatePath, useHistory } from 'react-router-dom';

import { TenantContext } from '../../context';

type Params = { [paramName: string]: string | number | boolean | undefined };
type GenerateFn = (path: string, params?: Params) => string;
type NavigateFn = (path: string, params?: Params, state?: H.LocationState) => void;

const useNavigate = (): { generatePath: GenerateFn; navigate: NavigateFn } => {
	const { tenantId } = useContext(TenantContext);
	const history = useHistory();

	const generate = (path: string, params?: Params): string =>
		generatePath(`/${tenantId}/sites${path}`, params);
	const navigate = (path: string, params?: Params, state?: H.LocationState): void =>
		history.push(generate(path, params), state);

	return {
		generatePath: generate,
		navigate,
	};
};

export default useNavigate;
