import { Controller, Get, Post, Body } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { OpenaiService } from '../openai/openai.service';
import { Routine } from './routine.entity';

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
  async generateAndSaveRoutine(@Body() body: any): Promise<any> {
    const { basicInfo, eatingHabit, activityHabit, activityGoal } = body;
    const prompt = `사용자 정보:
    - 이름: ${basicInfo.nick}
    - 성별: ${basicInfo.gender}
    - 생년월일: ${basicInfo.birth}
    - 키: ${basicInfo.height}cm
    - 체중: ${basicInfo.weight}kg
    - 목표 몸무게: ${activityGoal.goalWeight}kg
    - 목표 기간: 7일
    - 하루 식사 횟수: ${eatingHabit.mealCount}
    - 한 끼 섭취량: ${eatingHabit.mealAmout}
    - 탄수화물 섭취 횟수: ${eatingHabit.carbohydratePerMealCount}
    - 단백질 섭취 횟수: ${eatingHabit.proteinPerMealCount}
    - 채소 섭취 횟수: ${eatingHabit.vegetablePerMealCount}
    - 하루 물 섭취량: ${eatingHabit.waterIntakePerDay}
    - 술 섭취량: ${eatingHabit.alcoholIntake}
    - 평소 움직임: ${activityHabit.usualActivity}
    - 하루 걸음 수: ${activityHabit.dailyStep}
    - 푸쉬업 개수: ${activityHabit.pushUpCount}
    - 규칙적 운동 기간: ${activityHabit.isRegularActivity}
    - 규칙적 운동 유형: ${activityHabit.regularActivity}
    - 일주일 운동 일수: ${activityHabit.regularActivityCount}
    - 하루 운동 시간: ${activityHabit.activityTimePerDay}
    - 운동량 변화: ${activityHabit.changeActivity}
    - 주요 목표: ${activityGoal.activityGoal}
    - 주 운동 장소: ${activityGoal.activityPlace}
    - 선호 운동: ${activityGoal.preferenceActivity}
    
    위 사용자 정보를 바탕으로 7일간의 목표 기간 동안 매주 단위로 운동 루틴을 아래 예시대로 작성해줘. 가능한 한 응답 형식이 일관되도록 주의해줘. 구분자 "|" 기반 텍스트를 참고해서 사용자에게 맞는 7일간의 운동 루틴을 생성해줘. 각 항목은 파싱하기 쉽게 '|' 구분자로 구분해줘. 아래 예시에 있는 있는 루틴을 그대로 작성하지말고 사용자의 정보에 맞는 운동 루틴을 아래 형식처럼 작성해줘. Parsing 해서 Swift Struct 로 저장할거야. index out of range 가 나지 않도록 조심해줘.

    예시 출력 형식:
    |요일:월요일|부위:상체 근력 훈련 (가슴, 어깨, 삼두)|이름(영어):운동1|이름(한글):운동1 한글 이름|횟수:10회|세트:3세트|무게(kg):20kg|시간(초):null||이름(영어):운동2|이름(한글):운동2 한글 이름|횟수:12회|세트:3세트|무게(kg):15kg|시간(초):null||이름(영어):운동3|이름(한글):운동3 한글 이름|횟수:15회|세트:3세트|무게(kg):null|시간(초):50||요일:화요일|부위:유산소 운동|이름(영어):운동1|이름(한글):운동1 한글 이름|횟수:null|세트:null|무게(kg):null|시간(초):1800|...`;

    const responses = await this.openaiService.generateRoutine(prompt);
    const parsedResponse = this.parseResponse(responses[0], basicInfo.nick); // Add nick as userId
    await this.routineService.createBulk(parsedResponse);

    return {
      success: true,
      responses: responses[0],
      message: '성공',
    };
  }

  private parseResponse(response: string, userId: string): Partial<Routine>[] {
    const lines = response.split('||'); // 각 운동 루틴을 구분하는 구분자
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
