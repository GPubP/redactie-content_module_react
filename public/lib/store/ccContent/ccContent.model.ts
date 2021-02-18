import { BaseMultiEntityState } from '@redactie/utils';

import { ContentSchema } from '../../services/content';

export type CcContentModel = ContentSchema | ContentSchema[];

export type CcContentState = BaseMultiEntityState<CcContentModel | null, string>;
