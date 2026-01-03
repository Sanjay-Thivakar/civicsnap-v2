const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

const { VertexAI } = require("@google-cloud/vertexai");

admin.initializeApp();

const vertexAI = new VertexAI({
  project: process.env.GCLOUD_PROJECT,
  location: "asia-south1",
});

exports.aiEnhanceIssue = onDocumentCreated(
  {
    document: "issues/{issueId}",
    region: "asia-south1",
  },
  async (event) => {
    try {
      const data = event.data.data();
      if (!data || data.aiTitle) return;

      logger.info("Vertex AI trigger started for:", event.params.issueId);

      const model = vertexAI.getGenerativeModel({
        model: "gemini-1.0-pro",
      });

      const prompt = `
Generate a professional civic issue title and a 2–3 sentence summary.

User Title: ${data.userTitle}
Description: ${data.userDescription}
Category: ${data.category}
Severity: ${data.severity}

Respond ONLY as valid JSON:
{ "aiTitle": "", "aiSummary": "" }
`;

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const text = result.response.candidates[0].content.parts[0].text;

      logger.info("Vertex raw output:", text);

      const parsed = JSON.parse(text);

      await admin
        .firestore()
        .collection("issues")
        .doc(event.params.issueId)
        .update({
          aiTitle: parsed.aiTitle,
          aiSummary: parsed.aiSummary,
        });

      logger.info("AI fields written successfully");
    } catch (err) {
      logger.error("Vertex AI failed", err);
    }
  }
);
