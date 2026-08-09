import { addSignature, getSignatureCount } from '../../../lib/supabase';

export async function POST(req) {
    try {
        const data = await req.json();
        await addSignature(data);
        const total = await getSignatureCount();

        return Response.json({
            success: true,
            totalSignatures: total
        });
    } catch (error) {
        console.error("Sign error:", error);
        return Response.json(
            { error: "Failed to submit signature. Please try again." },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const total = await getSignatureCount();
        return Response.json({ totalSignatures: total });
    } catch (error) {
        console.error("Count error:", error);
        return Response.json({ error: "Failed to get count" }, { status: 500 });
    }
}