import { Controller, Get, Post, Body } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { OpenaiService } from '../openai/openai.service';
import { Routine } from './routine.entity';
import { UserInfo, createPrompt } from '../utils/user-info';

@Controller('routine')
export class RoutineController {
  constructor(
    private readonly routineService: RoutineService,
    private readonly openaiService: OpenaiService,
  ) {}

  @Get()
  findAll(): Promise<Routine[]> {
    return this.routineService.findAll();
  }

  @Post()
  async create(@Body() routine: Routine): Promise<Routine> {
    return this.routineService.create(routine);
  }

  @Post('generate')
  async generateAndSaveRoutine(@Body() body: UserInfo): Promise<any> {
    const prompt = createPrompt(body, 'routine');
    const responses = await this.openaiService.generateResponse(prompt);
    const parsedResponse = this.parseResponse(
      responses[0],
      body.basicInfo.nick,
    );
    const savedRoutines = await this.routineService.createBulk(parsedResponse);

    return {
      success: true,
      routines: savedRoutines,
      message: '성공',
    };
  }

  private parseResponse(response: string, userId: string): Partial<Routine>[] {
    const lines = response.split('||');
    const parsedData: Partial<Routine>[] = [];
    let week = 1;
    let currentDay = '';

    lines.forEach((line) => {
      const fields = line.split('|');
      const dayField = fields.find((field) => field.startsWith('요일:'));
      if (dayField) {
        currentDay = dayField.split(':')[1];
      }
      const exerciseAreaField = fields.find((field) =>
        field.startsWith('부위:'),
      );
      const exerciseNameENField = fields.find((field) =>
        field.startsWith('이름(영어):'),
      );
      const exerciseNameKRField = fields.find((field) =>
        field.startsWith('이름(한글):'),
      );
      const repsField = fields.find((field) => field.startsWith('횟수:'));
      const setsField = fields.find((field) => field.startsWith('세트:'));
      const weightField = fields.find((field) => field.startsWith('무게(kg):'));
      const durationField = fields.find((field) =>
        field.startsWith('시간(초):'),
      );

      if (exerciseAreaField && exerciseNameENField && exerciseNameKRField) {
        const dayRoutine: Partial<Routine> = {
          userId,
          week,
          day: currentDay || 'Unknown',
          exerciseArea: exerciseAreaField.split(':')[1] || 'Unknown',
          exerciseNameEN: exerciseNameENField.split(':')[1] || 'Unknown',
          exerciseNameKR: exerciseNameKRField.split(':')[1] || 'Unknown',
          reps: repsField ? repsField.split(':')[1] : 'Unknown',
          sets: setsField ? setsField.split(':')[1] : 'Unknown',
          weight: weightField ? weightField.split(':')[1] : 'Unknown',
          duration: durationField ? durationField.split(':')[1] : 'Unknown',
        };
        parsedData.push(dayRoutine);
      }

      if (currentDay === '일요일') {
        week++;
      }
    });

    return parsedData;
  }
}
