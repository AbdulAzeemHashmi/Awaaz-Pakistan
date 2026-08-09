/**
 * /api/transcribe — Server-side proxy to the Cloudflare Whisper Worker.
 *
 * The browser cannot call the Cloudflare Worker directly from localhost due to
 * CORS restrictions. This route reads the audio blob as an ArrayBuffer and
 * re-builds a fresh FormData with the correct binary payload before forwarding
 * to the Cloudflare Worker. Forwarding raw FormData directly causes the binary
 * to be serialized as a string, which Whisper rejects with a type mismatch error.
 */
export async function POST(request) {
    const workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL;

    if (!workerUrl) {
        return Response.json(
            { error: 'Cloudflare Worker URL is not configured. Set NEXT_PUBLIC_CLOUDFLARE_WORKER_URL in .env.local' },
            { status: 503 }
        );
    }

    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio');

        if (!audioFile) {
            return Response.json({ error: 'No audio field in request' }, { status: 400 });
        }

        // Read the audio as raw bytes and re-wrap in a fresh Blob so the
        // multipart boundary sent to the Worker contains correct binary data.
        const arrayBuffer = await audioFile.arrayBuffer();
        const audioBlob = new Blob([arrayBuffer], { type: audioFile.type || 'audio/webm' });

        const outForm = new FormData();
        outForm.append('audio', audioBlob, audioFile.name || 'audio.webm');

        const workerResponse = await fetch(workerUrl, {
            method: 'POST',
            body: outForm,
        });

        if (!workerResponse.ok) {
            const errorText = await workerResponse.text();
            console.error(`Worker responded ${workerResponse.status}:`, errorText);
            return Response.json(
                { error: `Worker error: ${workerResponse.status}`, detail: errorText },
                { status: workerResponse.status }
            );
        }

        const data = await workerResponse.json();
        return Response.json(data);

    } catch (err) {
        console.error('Transcription proxy error:', err);
        return Response.json(
            { error: 'Failed to reach transcription service', detail: err.message },
            { status: 502 }
        );
    }
}
