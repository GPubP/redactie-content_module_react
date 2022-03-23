import { SiteResponse } from '@redactie/sites-module';

export interface ContentInfoTooltipProps {
	contentId: string | undefined;
	icon: string;
	className: string;
	site: SiteResponse | undefined;
}
