const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
require("dotenv").config();
const app = express();
app.use(bodyParser.json());

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_KEY;
const deploymentId = "gpt-4o";
const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

router.post('/activity-routine', async (req, res) => {
  console.log("== Chat Completions Sample ==");

  const { basicInfo, eatingHabit, activityHabit, activityGoal } = req.body;
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
  - 무릎대고 푸쉬업 개수: ${activityHabit.pushUpCount}
  - 규칙적 운동 기간: ${activityHabit.isRegularActivity}
  - 규칙적 운동 유형: ${activityHabit.regularActivity}
  - 일주일 운동 일수: ${activityHabit.regularActivityCount}
  - 하루 운동 시간: ${activityHabit.activityTimePerDay}
  - 운동량 변화: ${activityHabit.changeActivity}
  - 주요 목표: ${activityGoal.activityGoal}
  - 주 운동 장소: ${activityGoal.activityPlace}
  - 선호 운동: ${activityGoal.preferenceActivity}
  
  위 사용자 정보를 바탕으로 7일간의 목표 기간 동안 매주 단위로 운동 루틴을 아래 예시대로 작성해주세요.
  
  예시 출력 형식:
  1주차 운동 루틴:
  - **월요일: 상체 근력 훈련(가슴, 어깨, 삼두)** \n - 벤치프레스: (6kg 10회) 4세트  
  - 화요일: ...
  - 수요일: ...
  - 목요일: ...
  - 금요일: ...
  - 토요일: ...
  - 일요일: ...
  `

  try {
    const result = await client.getChatCompletions(deploymentId, [
      { role: "system", content: "You are an AI assistant that helps people find information." },
      { role: "user", content: prompt }
    ]);

    const responses = result.choices.map((choice) => choice.message.content);

    res.json({
      success: true,
      responses: responses, 
      message: "성공"
    })
  } catch(err) {
    res.json({
      success: false,
      response: [],
      message: err
    })
  }
})

//식단 루틴 생성
router.post('/meal-routine', async (req, res) => {
  console.log("== Chat Completions Sample ==");

  const { basicInfo, eatingHabit, activityHabit, activityGoal } = req.body;
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
  - 무릎대고 푸쉬업 개수: ${activityHabit.pushUpCount}
  - 규칙적 운동 기간: ${activityHabit.isRegularActivity}
  - 규칙적 운동 유형: ${activityHabit.regularActivity}
  - 일주일 운동 일수: ${activityHabit.regularActivityCount}
  - 하루 운동 시간: ${activityHabit.activityTimePerDay}
  - 운동량 변화: ${activityHabit.changeActivity}
  - 주요 목표: ${activityGoal.activityGoal}
  - 주 운동 장소: ${activityGoal.activityPlace}
  - 선호 운동: ${activityGoal.preferenceActivity}
  
  위 사용자 정보를 바탕으로 7일간의 목표 기간 동안 한주 단위로 식단 루틴을 아래 예시대로 작성해주세요.
  
  예시 출력 형식:
  1주치 식단 루틴:
  - 월요일: ...
  - 화요일: ...
  - 수요일: ...
  - 목요일: ...
  - 금요일: ...
  - 토요일: ...
  - 일요일: ...
  `

  try {
    const result = await client.getChatCompletions(deploymentId, [
      { role: "system", content: "You are an AI assistant that helps people find information." },
      { role: "user", content: prompt }
    ]);

    const responses = result.choices.map((choice) => choice.message.content);

    res.json({
      success: true,
      responses: responses, 
      message: "성공"
    })
  } catch(err) {
    res.json({
      success: false,
      response: [],
      message: err
    })
  }
})



module.exports = router;