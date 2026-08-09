export default {
    async fetch(request, env) {
        if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        const formData = await request.formData();
        const audioFile = formData.get('audio');
        const language = formData.get('language') || 'en';

        const audioBuffer = await audioFile.arrayBuffer();

        const response = await env.AI.run('@cf/openai/whisper-large-v3-turbo', {
            audio: [...new Uint8Array(audioBuffer)],
        });

        return Response.json({ text: response.text });
    }
};