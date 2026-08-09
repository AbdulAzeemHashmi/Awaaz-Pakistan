import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AppealSchema } from "./schemas";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-exp",
    temperature: 0.4,
    apiKey: process.env.GEMINI_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are a professional legal advocate helping Pakistani software developers appeal LinkedIn account restrictions.

You MUST respond in JSON format matching the provided schema.
- Subject must be in English.
- Body English must be formal and professional.
- Body Urdu must be a flawless translation of the professional tone (Right-to-Left script).
- Instructions for the user must be concise (max 2 sentences).

User Details:
Full Name: {fullName}
LinkedIn Email: {email}
Document Held: {documentType}
User's Additional Message (if any): {userMessage}
`,
    ],
    ["user", "Generate the appeal for me."],
]);

// Use withStructuredOutput to enforce the Zod schema (AppealSchema)
const structuredModel = model.withStructuredOutput(AppealSchema);

const chain = prompt.pipe(structuredModel);

export { chain };