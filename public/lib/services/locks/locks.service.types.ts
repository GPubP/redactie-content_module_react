export interface LockResponse {
	id: string;
	type: string;
	siteId: string | null;
	expireAt: string;
	meta: {
		lastEditor?: {
			address: string | null;
			domain: string | null;
			email: string | null;
			externalMutableReference: string | null;
			firstname: string | null;
			id: string;
			lastname: string | null;
			nickname: string | null;
			type: string | null;
			username: string | null;
		};
	};
}
