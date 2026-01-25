
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define the response structure we expect from AI
const MOCK_RESPONSE = {
    hook: "단 3초 만에 시선을 사로잡는 마법 같은 문구!\n이 상품이 당신의 고민을 해결해드립니다.",
    features: "AI가 분석한 정교한 상세 설명이 이곳에 들어갑니다.\n1. 첫 번째 장점에 대한 구체적인 설명과 이득\n2. 두 번째 장점을 뒷받침하는 근거\n3. 사용자가 얻을 수 있는 실제적인 혜택 강조",
    trust: "이미 5,000명이 선택한 검증된 품질!\n재구매율 98%가 증명하는 압도적인 만족도를 경험하세요.",
    closing: "고민은 배송만 늦출 뿐,\n지금 바로 최저가 혜택으로 만나보세요!"
};

export const runtime = 'edge'; // Cloudflare Pages(Edge) 호환 설정

export async function POST(req: Request) {
    try {
        const { productName, benefits, targetAudience, tone } = await req.json();

        // 1. Check if API Key exists
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.warn("⚠️ No OPENAI_API_KEY found. Returning mock data.");
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            return NextResponse.json(MOCK_RESPONSE);
        }

        // 2. Initialize OpenAI
        const openai = new OpenAI({ apiKey });

        // 3. Construct the prompt
        const systemPrompt = `
      너는 네이버 스마트스토어 상세페이지 전문 카피라이터이자 마케터야.
      사용자가 입력한 상품 정보를 바탕으로 구매 전환율이 높은 상세페이지 섹션별 문구를 작성해줘.
      
      반환 형식은 반드시 아래 JSON 포맷을 따라야 해:
      {
        "hook": "고객의 페인포인트를 자극하고 호기심을 유발하는 강력한 도입부 (2-3문장)",
        "features": "상품의 핵심 장점 3가지를 구체적이고 설득력 있게 풀어쓴 본문 (각 장점별로 줄바꿈하여 작성)",
        "trust": "신뢰도를 높일 수 있는 리뷰 요약이나 품질 보증 멘트 (2문장)",
        "closing": "구매를 망설이는 고객을 위한 강력한 클로징 멘트 (1-2문장)"
      }

      톤앤매너: ${tone === 'emotional' ? '감성적이고 따뜻한' : tone === 'witty' ? '재치있고 유머러스한' : '신뢰감 있고 전문적인'}
    `;

        const userMessage = `
      상품명: ${productName}
      타겟 고객: ${targetAudience}
      핵심 장점: ${benefits.join(', ')}
    `;

        // 4. Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // or gpt-4o-mini
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            throw new Error("No content generated");
        }

        return NextResponse.json(JSON.parse(content));

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate content" },
            { status: 500 }
        );
    }
}
