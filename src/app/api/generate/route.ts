import { NextResponse } from 'next/server';

// Define the response structure we expect from AI
const MOCK_RESPONSE = {
    hook: "단 3초 만에 시선을 사로잡는 마법 같은 문구!\n이 상품이 당신의 고민을 해결해드립니다.",
    features: "AI가 분석한 정교한 상세 설명이 이곳에 들어갑니다.\n1. 첫 번째 장점에 대한 구체적인 설명과 이득\n2. 두 번째 장점을 뒷받침하는 근거\n3. 사용자가 얻을 수 있는 실제적인 혜택 강조",
    trust: "이미 5,000명이 선택한 검증된 품질!\n재구매율 98%가 증명하는 압도적인 만족도를 경험하세요.",
    closing: "고민은 배송만 늦출 뿐,\n지금 바로 최저가 혜택으로 만나보세요!"
};

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { productName, benefits, targetAudience, tone } = await req.json();

        // 1. Check if API Key exists
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            console.warn("⚠️ No GOOGLE_API_KEY found. Returning mock data.");
            await new Promise(resolve => setTimeout(resolve, 2000));
            return NextResponse.json(MOCK_RESPONSE);
        }

        // 2. Direct Fetch to Gemini API (Edge Compatible)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // 3. Construct the prompt
        const prompt = `
      당신은 대한민국 상위 1% 매출을 올리는 '상세페이지 기획자'이자 '카피라이터'입니다.
      사용자가 입력한 [기초 자료]를 바탕으로, 소비자가 구매 버튼을 누를 수밖에 없는 매력적인 상세페이지 문구를 작성해주세요.

      [기초 자료 분석]
      1. 상품명: ${productName}
      2. 타겟 고객: ${targetAudience}
      3. 핵심 장점: ${(Array.isArray(benefits) ? benefits : []).filter((b: any) => typeof b === 'string' && b.trim() !== '').join(', ')}
      
      [작성 가이드]
      - 톤앤매너: ${tone === 'emotional' ? '감성적이고 공감가는 에세이 톤' : tone === 'witty' ? '재치있고 유머러스한 친구 같은 톤' : '전문적이고 신뢰감 있는 비즈니스 톤'}
      - 반환 형식: 반드시 아래 JSON 포맷을 준수하십시오. JSON 외에 다른 설명이나 마크다운(\`\`\`json ...)은 절대 포함하지 마십시오. 오직 순수한 JSON 문자열만 반환하십시오.
      
      {
        "hook": "고객의 문제(Pain Point)를 찌르는 강렬한 첫 문장 (2-3줄)",
        "features": "핵심 장점 3가지를 '고객의 이득(Benefit)'으로 변환하여 설득력 있게 서술 (이모지 활용)",
        "trust": "신뢰도를 높이는 가상의 리뷰 데이터나 품질 보증 언급 (2-3줄)",
        "closing": "구매를 망설이는 고객을 위한 강력한 행동 유도(CTA) (1-2줄)"
      }
    `;

        // 4. Call Gemini API via Fetch
        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.error("Gemini API Error Details:", errorData);
            throw new Error(errorData.error?.message || `Gemini API responded with ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("No text generated from Gemini");
        }

        // 5. Clean up JSON string (remove markdown code blocks if present)
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        console.log("Gemini Output:", text);

        try {
            const parsed = JSON.parse(text);
            return NextResponse.json(parsed);
        } catch (parseError) {
            console.error("JSON Parse Error. Raw Text:", text);
            throw new Error("AI returned invalid JSON format.");
        }

    } catch (error: any) {
        console.error("AI Generation Error details:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate content" },
            { status: 500 }
        );
    }
}
