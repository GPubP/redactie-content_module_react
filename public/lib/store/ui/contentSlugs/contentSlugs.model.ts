import { ActiveState, EntityState } from '@datorama/akita';

export interface ContentSlugModel {
	id: string;
	contentId: string;
	slug: string;
	isValid: boolean;
	loading: boolean;
}

export interface ContentSlugState extends EntityState<ContentSlugModel, string>, ActiveState {}

export const createInitialContentSlugState = (): ContentSlugState => ({
	active: null,
});
