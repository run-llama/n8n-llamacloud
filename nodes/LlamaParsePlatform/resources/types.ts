export type ParseStatus = {
	job?: { status?: string; error_message?: string };
	markdown_full?: string;
	text_full?: string;
};

/** Shape of GET /api/v2/extract/{id} (fields are optional / expand-dependent). */
export type ExtractStatus = {
	id?: string;
	project_id?: string;
	file_input?: unknown;
	document_input_value?: unknown;
	configuration_id?: string | null;
	configuration?: unknown;
	status?: string;
	error_message?: string | null;
	extract_result?: unknown;
	extract_metadata?: unknown;
	metadata?: unknown;
	grounded_items?: unknown;
	usage?: unknown;
	created_at?: string;
	updated_at?: string;
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
