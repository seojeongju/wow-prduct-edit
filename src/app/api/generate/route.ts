
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
      당신은 대한민국 상위 1% 매출을 올리는 '상세페이지 기획자'이자 '카피라이터'입니다.
      사용자가 입력한 [기초 자료]를 바탕으로, 소비자가 구매 버튼을 누를 수밖에 없는 매력적인 상세페이지 문구를 작성해주세요.

      [기조 자료 분석]
      1. 상품명: ${productName} (이 상품의 핵심 아이덴티티입니다.)
      2. 타겟 고객: ${targetAudience} (이 문구는 오직 이들을 설득하기 위해 작성되어야 합니다.)
      3. 핵심 장점: ${benefits.join(', ')} (이 장점들이 단순한 기능이 아니라, 고객의 삶을 어떻게 바꿔주는지 '혜택(Benefit)' 관점으로 변환해서 작성하세요.)
      
      [작성 가이드]
      - 톤앤매너: ${tone === 'emotional' ? '감성적이고 공감가는 에세이 톤' : tone === 'witty' ? '재치있고 유머러스한 친구 같은 톤' : '전문적이고 신뢰감 있는 비즈니스 톤'}
      - 문체: 가독성을 위해 간결하고 명확하게. 모바일 환경을 고려하여 줄바꿈을 적절히 활용.
      
      [반환 포맷 (JSON Only)]
      반드시 아래 JSON 형식으로만 응답하세요. (마크다운 포맷 제외)
      {
        "hook": "고객의 문제 상황(Pain Point)을 짚어내고, 우리 상품이 해결책임을 암시하는 강렬한 첫 문장. (타겟 고객이 듣고 싶어하는 말로 시작)",
        "features": "입력된 3가지 핵심 장점을 하나씩 확장하여 서술. 각 장점마다 이모지를 활용하고, '기능'이 아닌 '고객이 얻는 이득'으로 치환하여 설득력 있게 작성.",
        "trust": "고객이 안심하고 구매할 수 있는 신뢰 강화 문구. 가상의 리뷰 수치나 만족도 통계, 혹은 품질 보증 정책을 언급하여 불안감 해소.",
        "closing": "지금 당장 구매해야 하는 이유. 망설이는 고객의 등을 떠미는 강력한 한 마디와 행동 유도(Call To Action)."
      }
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
