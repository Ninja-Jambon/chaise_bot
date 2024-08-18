import MistralClient from '@mistralai/mistralai';
import "dotenv/config";

export interface MistralMessage {
	role: string,
	content: string,
}

export enum Models {
	tiny = "open-mistral-7b",
	multi_tiny = "open-mixtral-8x7b",
	small = "mistral-small-latest",
	medium = "mistral-medium-latest",
	large = "mistral-large-latest",
}

export enum InputPrice {
	tiny = 0.25 / 1000000,
	multi_tiny = 0.7 / 1000000,
	small = 2 / 1000000,
	medium = 2.7 / 1000000,
	large = 8 / 1000000,
}

export enum OutputPrice {
	tiny = 0.25 / 1000000,
	multi_tiny = 0.7 / 1000000,
	small = 6 / 1000000,
	medium = 8.1 / 1000000,
	large = 24 / 1000000,
}

export interface ReturnedValue {
	message: string,
	promptUsage: number,
	responseUsage: number,
}

export enum Prompts {
	default = "Tu es un bot discord qui répond amicalement.",
	qotd = `Tu es un bot discord qui envoie des questions du jour sur un thème donné par l'utilisateur ou de ton choix s'il n'en a pas donné. Tu ne dois répondre avec ce format json : {qotd: String}. 
			Voici plus d'info :
			Ton à employer: amical
			But des questions: faire en sorte que les membres parlent d'eux
			Exemples de questions:
			- Quel est votre parfun de glaces préféré et pourquoi ?
			- Si c'était la fin du monde que feriez vous ?
			- Si vous deviez ressuscité un personnage de film/série/livre ça serait qui et pourquoi ?
			- Si tu pouvais redessiner la carte du monde, quels pays fusionnerais-tu ou diviserais-tu, et pour quelles raisons?`
}

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

export async function getChatResponse(messages: MistralMessage[], model: Models): Promise<ReturnedValue> {
	const chatResponse = await client.chat({
		model: model,
		messages: messages,
		maxTokens: 450,
	});

	return {
		message: chatResponse.choices[0].message.content,
		promptUsage: chatResponse.usage.prompt_tokens,
		responseUsage: chatResponse.usage.completion_tokens,
	};
}

export async function getQotd(messages: MistralMessage[], model: Models): Promise<ReturnedValue> {
	const chatResponse = await client.chat({
		model: model,
		// @ts-ignore: Unreachable code error
		response_format: {'type': 'json_object'},
		messages: messages,
	});

	return {
		message: chatResponse.choices[0].message.content,
		promptUsage: chatResponse.usage.prompt_tokens,
		responseUsage: chatResponse.usage.completion_tokens,
	};
}