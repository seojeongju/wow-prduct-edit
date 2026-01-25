"use client";

import React, { useState } from 'react';
import ProductInput from '@/components/dashboard/ProductInput';
import MobilePreview from '@/components/preview/MobilePreview';
import { ProductData } from '@/types';

export default function Home() {
  const [productData, setProductData] = useState<ProductData>({
    productName: '',
    benefits: ['', '', ''],
    targetAudience: '',
    tone: 'professional',
    imageUrl: null,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!productData.productName) return alert("상품명을 입력해주세요.");

    setIsGenerating(true);

    // Simulate AI Generation
    setTimeout(() => {
      setProductData(prev => ({
        ...prev,
        generatedContent: {
          hook: `왜 ${prev.productName}를 선택해야 할까요?\n지금 그 이유를 확인하세요.`,
          features: "Generated content description...",
          trust: "네이버 쇼핑 만족도 1위\n재구매율 98% 달성",
          closing: "지금 바로 시작하세요."
        }
      }));
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-blue-100">

      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 left-0 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-serif italic text-lg pr-1 pt-1">S</span>
            SmartDetail
          </div>
          <div className="text-sm font-medium text-neutral-500">
            Beta v1.0
          </div>
        </div>
      </nav>

      <div className="pt-16 min-h-screen flex flex-col lg:flex-row max-w-7xl mx-auto">

        {/* Left: Dashboard Input */}
        <section className="flex-1 lg:max-w-2xl border-r border-neutral-100 min-h-[calc(100vh-64px)] overflow-y-auto">
          <ProductInput
            data={productData}
            onChange={setProductData}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </section>

        {/* Right: Preview (Sticky) */}
        <section className="hidden lg:block flex-1 bg-neutral-50/50">
          <MobilePreview
            data={productData}
            isLoading={isGenerating}
          />
        </section>

        {/* Mobile View Preview Button or Modal would go here for mobile users, 
            but for now we focused on Desktop Dashboard + Mobile Preview per requirement 
        */}
      </div>
    </main>
  );
}
