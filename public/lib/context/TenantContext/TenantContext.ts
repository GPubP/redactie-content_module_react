import { createContext } from 'react';

import { TenantContextValue } from './TenantContext.types';

const TenantContext = createContext<TenantContextValue>({ tenantId: '' });

export default TenantContext;
