import { BaseEntityState } from '@redactie/utils';

import { LockResponse } from '../../services/locks/locks.service.types';

export type LockModel = LockResponse;

export type LocksState = BaseEntityState<LockModel, string>;
