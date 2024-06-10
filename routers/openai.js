const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

// Load the .env file if it exists
require("dotenv").config();

// You will need to set these environment variables or edit the following values
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_KEY;

async function main() {
  console.log("== Chat Completions Sample ==");

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const deploymentId = "gpt-4o";
  const result = await client.getChatCompletions(deploymentId, [
    { role: "system", content: "You are an AI assistant that helps people find information." },
    { role: "user", content: "아이유는 누구야?" }
  ]);

  for (const choice of result.choices) {
    console.log(choice.message);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };