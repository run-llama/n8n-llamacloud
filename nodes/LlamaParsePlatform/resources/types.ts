export type ParseStatus = {
	job?: { status?: string; error_message?: string };
	markdown_full?: string;
	text_full?: string;
};

export type ExtractStatus = {
	status?: string;
	error_message?: string;
	extract_result?: unknown;
};

export interface ClassifyRule {
	type: string;
	description: string;
}

export type ClassifyStatus = {
	status?: string;
	error_message?: string;
	result?: {
		type?: string;
		reasoning?: string;
		confidence?: number;
	};
};

export interface SplitCategory {
	name: string;
	description?: string;
}

export interface SplitSegmentResult {
	category: string;
	confidence_category: string;
	pages: number[];
}

export type SplitStatus = {
	id?: string;
	status?: string;
	error_message?: string;
	result?: {
		segments?: SplitSegmentResult[];
	};
};
