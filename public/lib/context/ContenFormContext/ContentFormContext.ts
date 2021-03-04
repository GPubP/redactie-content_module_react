import { createContext } from 'react';

import { ContentFormContextValue } from './ContentFormContext.types';

const ContentFormContext = createContext<ContentFormContextValue>({
	contentType: null,
});

export default ContentFormContext;
