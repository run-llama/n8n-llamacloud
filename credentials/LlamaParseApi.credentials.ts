import {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LlamaParseApi implements ICredentialType {
	name = 'llamaParseApi';
	displayName = 'LlamaParse API';
	icon: Icon = { light: 'file:./llamaindex_white.svg', dark: 'file:./llamaindex_dark.svg' };
	documentationUrl = 'https://developers.llamaindex.ai/llamaparse/general/api_key/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Base API URL',
			name: 'baseURL',
			type: 'string',
			default: 'https://api.cloud.llamaindex.ai',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Accept: 'application/json',
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			url: '={{$credentials.baseURL}}/api/v1/projects',
		},
	};
}
