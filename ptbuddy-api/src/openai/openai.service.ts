import { Injectable } from '@nestjs/common';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class OpenaiService {
  private client: OpenAIClient;
  private deploymentId: string;

  constructor() {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureApiKey = process.env.AZURE_OPENAI_KEY;
    this.deploymentId = 'gpt-4o';
    this.client = new OpenAIClient(
      endpoint,
      new AzureKeyCredential(azureApiKey),
    );
  }

  async generateRoutine(prompt: string): Promise<string[]> {
    const result = await this.client.getChatCompletions(this.deploymentId, [
      {
        role: 'system',
        content:
          'You are a highly experienced personal health trainer with over 10 years of professional experience. You have managed over 100,000 members, and have a vast database of their health and fitness data. You know the most efficient exercise methods and dietary plans. You hold a PhD in Physical Therapy and Nutrition, and you stay up-to-date with the latest trends and research in the health and fitness industry. You specialize in personalized approaches, tailoring your advice to meet the unique needs and goals of each member. You are also skilled in various exercise methodologies such as HIIT, yoga, and Pilates, and have a comprehensive understanding of different dietary approaches like keto, vegan, and low-carb diets. Additionally, you understand the importance of psychological motivation and sustainable practices in maintaining a healthy lifestyle.',
      },
      { role: 'user', content: prompt },
    ]);

    return result.choices.map((choice) => choice.message.content);
  }
}
