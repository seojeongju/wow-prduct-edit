
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

        // 2. Initialize Google Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 3. Construct the prompt
        const prompt = `
      당신은 대한민국 최고의 이커머스 카피라이터이자 마케팅 전략가입니다.
      당신의 목표는 "구매 전환율"을 극대화하는 상세페이지 문구를 작성하는 것입니다.
      입력된 상품 정보를 바탕으로 소비자의 감정을 자극하고 논리적으로 설득하세요.
      
      반환 형식은 반드시 아래의 JSON 포맷을 준수해야 합니다. 마크다운(\`\`\`json)이나 기타 태그 없이, 순수 JSON 문자열만 반환하세요:
      {
        "hook": "고객의 잠재된 니즈나 페인포인트를 날카롭게 찌르는 도입부. 3초 안에 시선을 멈추게 하는 강렬한 한 문장과 이를 뒷받침하는 서브 문구 (총 2-3줄)",
        "features": "단순한 스펙 나열이 아닌, 고객이 얻을 수 있는 '혜택(Benefit)' 중심으로 작성. 각 핵심 장점별로 이모지(✨, ✅ 등)를 활용하여 가독성 있게 작성. (장점 3가지를 자연스럽게 연결하여 5-7줄 분량)",
        "trust": "소비자의 불안을 해소하는 신뢰 강화 멘트. 가상의 리뷰 통계나 품질 보증 정책을 언급하여 안심하고 구매할 수 있도록 유도 (2-3줄)",
        "closing": "지금 사야 하는 이유를 강조하는 강력한 클로징. 한정된 기회나 즉각적인 혜택을 암시하며 구매 버튼 클릭을 유도 (1-2줄)"
      }

      선택된 톤앤매너: ${tone === 'emotional' ? '감성적이고 따뜻한, 공감을 불러일으키는 에세이 스타일' : tone === 'witty' ? '재치있고 유머러스한, 친구에게 말하는 듯한 친근한 스타일' : '신뢰감 있고 전문적인, 팩트 중심의 정중한 비즈니스 스타일'}
      
      작성 원칙:
      1. 모호한 표현(좋은, 최고인 등)을 피하고 구체적이고 감각적인 단어를 사용하세요.
      2. 문장은 모바일 가독성을 위해 간결하게 끊어 쓰세요.
      3. 타겟 고객(${targetAudience})이 평소에 쓰는 말투와 용어를 사용하세요.

      [상품 정보]
      상품명: ${productName}
      타겟 고객: ${targetAudience}
      핵심 장점 리스트: ${benefits.join(', ')}
    `;

        // 4. Generate Content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // 5. Clean up JSON string (remove markdown code blocks if present)
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        console.log("Gemini Output:", text);

        return NextResponse.json(JSON.parse(text));

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate content" },
            { status: 500 }
        );
    }
}
