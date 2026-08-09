export async function POST(req) {
    try {
        const { text, target } = await req.json();

        const response = await fetch('https://libretranslate.com/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                source: 'auto',
                target: target,
                format: 'text'
            })
        });

        const data = await response.json();
        return Response.json({ translatedText: data.translatedText });
    } catch (error) {
        console.error("Translation error:", error);
        return Response.json(
            { error: "Translation failed" },
            { status: 500 }
        );
    }
}