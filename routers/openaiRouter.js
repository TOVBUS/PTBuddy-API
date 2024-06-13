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
  
  위 사용자 정보를 바탕으로 7일간의 목표 기간 동안 매주 단위로 운동 루틴을 아래 예시대로 작성해줘. 내가 가진 운동 리스트 안에서 루틴을 추천해줘야 해. 운동의 이름은 "영어 운동 타이틀:한글 이름 타이틀" 형식으로 제공해줘.
  가능한 한 응답 형식이 일관되도록 주의해줘. 예를 들어, '홍길동님' 또는 '토브님'과 같은 사용자의 이름이 바뀌어도 아래 예시 형식을 유지해줘.
  아래의 구분자 기반 텍스트를 참고해서 사용자에게 맞는 7일간의 운동 루틴을 생성해줘. 각 항목은 파싱하기 쉽게 '|' 구분자로 구분해줘. 예시에 있는 루틴을 그대로 작성하지마. 사용자의 목표에 맞는 운동 루틴을 아래 형식처럼 작성해줘. Parsing 해서 Swift Struct 로 저장할거야. index out of range 가 나지 않도록 조심해줘. 운동 카테고리에 수영, 휴식은 없어.

  예시 출력 형식: 
  1주차 운동 루틴|월요일|상체 근력 훈련 (가슴, 어깨, 삼두)|Bench Press|벤치 프레스|10회|3세트|20|null|Shoulder Press|숄더 프레스|12회|3세트|15|null|Tricep Dips|트라이셉 딥스|15회|3세트|null|null|화요일|유산소 운동|Running|달리기|null|null|null|1800
  `;

  try {
    const result = await client.getChatCompletions(deploymentId, [
      { role: "system", content: "You are a highly experienced personal health trainer with over 10 years of professional experience. You have managed over 100,000 members, and have a vast database of their health and fitness data. You know the most efficient exercise methods and dietary plans. You hold a PhD in Physical Therapy and Nutrition, and you stay up-to-date with the latest trends and research in the health and fitness industry. You specialize in personalized approaches, tailoring your advice to meet the unique needs and goals of each member. You are also skilled in various exercise methodologies such as HIIT, yoga, and Pilates, and have a comprehensive understanding of different dietary approaches like keto, vegan, and low-carb diets. Additionally, you understand the importance of psychological motivation and sustainable practices in maintaining a healthy lifestyle." },
      { role: "user", content: prompt }
    ]);

    const responses = result.choices.map((choice) => choice.message.content);

    res.json({
      success: true,
      responses: responses[0], // 이 부분을 파싱된 텍스트로 반환
      message: "성공"
    })
  } catch(err) {
    res.json({
      success: false,
      response: [],
      message: err.message
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
