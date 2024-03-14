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

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

export async function getChatResponse(messages: MistralMessage[], model: Models): Promise<ReturnedValue> {
    const chatResponse = await client.chat({
        model: model,
        messages: messages,
    });

    return {
        message: chatResponse.choices[0].message.content,
        promptUsage: chatResponse.usage.prompt_tokens,
        responseUsage: chatResponse.usage.completion_tokens,
    };
}