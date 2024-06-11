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
  const prompt = `Create a 1-week exercise routine for a ${basicInfo.age} year old ${basicInfo.gender} who wants to reach ${activityGoal.goalWeight}kg with a goal of ${activityGoal.activityGoal}. The user currently exercises ${activityHabit.exerciseFrequency} and eats a ${eatingHabit.dietType} diet. The user prefers ${activityGoal.preferenceActivity} at ${activityGoal.activityPlace} and plans to exercise ${activityGoal.activityFrequency}.`;

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