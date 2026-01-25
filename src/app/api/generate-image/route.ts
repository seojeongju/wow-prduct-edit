
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

// Mock image for demo (A nice placeholder)
const MOCK_IMAGE_URL = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop";

export async function POST(req: Request) {
    try {
        const { prompt, type } = await req.json(); // type: 'generation' | 'edit'(future)

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.warn("⚠️ No OPENAI_API_KEY found. Returning mock image.");
            await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate AI time
            return NextResponse.json({ url: MOCK_IMAGE_URL });
        }

        const openai = new OpenAI({ apiKey });

        // DALL-E 3 Generation
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `High quality, commercial product photography, standard 4:3 aspect ratio. ${prompt}`,
            n: 1,
            size: "1024x1024",
        });

        const imageUrl = response.data?.[0]?.url;

        if (!imageUrl) throw new Error("No image generated");

        return NextResponse.json({ url: imageUrl });

    } catch (error) {
        console.error("Image Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate image" },
            { status: 500 }
        );
    }
}
