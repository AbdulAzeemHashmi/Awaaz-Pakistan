import { chain } from '../../../lib/langchain-chain';

export async function POST(req) {
    try {
        const { fullName, email, documentType, userMessage } = await req.json();

        const result = await chain.invoke({
            fullName: fullName || "Pakistani Professional",
            email: email || "user@example.com",
            documentType: documentType || "CNIC (regular, non-smart)",
            userMessage: userMessage || "My account was unfairly restricted during verification.",
        });

        return Response.json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error("LangChain error:", error);
        return Response.json(
            { error: "AI generation failed. Please try again." },
            { status: 500 }
        );
    }
}