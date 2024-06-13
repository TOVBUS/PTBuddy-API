import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { UserInfo, createPrompt } from '../utils/user-info';

@Controller('meal')
export class MealController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('generate')
  async generateMealRoutine(@Body() body: UserInfo): Promise<any> {
    const prompt = createPrompt(body, 'meal');
    const responses = await this.openaiService.generateResponse(prompt);

    return {
      success: true,
      responses: responses[0],
      message: '성공',
    };
  }
}
