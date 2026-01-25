"use client";

import React, { useState } from 'react';
import ProductInput from '@/components/dashboard/ProductInput';
import MobilePreview from '@/components/preview/MobilePreview';
import { ProductData } from '@/types';
import { Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [productData, setProductData] = useState<ProductData>({
    productName: '',
    benefits: ['', '', ''],
    targetAudience: '',
    tone: 'professional',
    imageUrl: null,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Simplified dummy generation for UI implementation
  const handleGenerate = async () => {
    if (!productData.productName) return alert("상품명을 입력해주세요.");
    setIsGenerating(true);

    try {
      // 실제 API 호출 로직은 ProductInput이나 별도 핸들러에서 수행
      // 여기서는 UI 테스트를 위해 fetch 호출
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error("Error");
      const data = await response.json();
      setProductData(prev => ({ ...prev, generatedContent: data }));
    } catch (e) {
      console.error(e);
      // Fallback for presentation if API fails
      setTimeout(() => {
        setProductData(prev => ({
          ...prev,
          generatedContent: {
            hook: `🔥 지금 주문 폭주 중!\n${prev.productName}, 왜 다들 난리일까요?`,
            features: "1. 믿을 수 없는 퀄리티로 압도적인 만족감\n2. 사용자 중심의 설계로 편리함 극대화\n3. 어디서도 볼 수 없는 독보적인 디자인",
            trust: "⭐⭐⭐⭐⭐\n'인생 아이템을 만났어요!'\n이미 3천명이 선택한 이유가 있습니다.",
            closing: "고민은 배송만 늦출 뿐입니다.\n지금 바로 시작하세요."
          }
        }));
      }, 1500);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="h-screen w-full flex flex-col overflow-hidden bg-slate-50 relative selection:bg-indigo-100 selection:text-indigo-900">

      {/* Background Decor */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] z-0 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="flex-none h-16 px-6 lg:px-10 flex items-center justify-between z-20 border-b border-slate-200/60 bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Smart Detail</h1>
            <p className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">AI Commerce Editor</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
            <Zap className="w-3.5 h-3.5 mr-1.5 fill-current" />
            <span>Beta v0.9 (Free Access)</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-white shadow-sm">
            {/* Fallback Avatar */}
            <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 text-xs">U</div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden z-10 relative">

        {/* Left Panel: Editor */}
        <div className="w-full lg:w-[450px] xl:w-[500px] flex-none h-full overflow-y-auto scrollbar-hide border-r border-slate-200/60 bg-white/40 backdrop-blur-3xl">
          <ProductInput
            data={productData}
            onChange={setProductData}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* Right Panel: Preview Studio */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-100/50 relative overflow-hidden">
          {/* Studio ambient elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[600px] h-[600px] border border-slate-200 rounded-full opacity-50" />
            <div className="absolute w-[400px] h-[400px] border border-slate-200 rounded-full opacity-60" />
          </div>

          <div className="relative z-10 scale-[0.9] xl:scale-100 transition-transform duration-500">
            <MobilePreview data={productData} isLoading={isGenerating} />
          </div>

          {/* Floating Status */}
          <div className="absolute bottom-8 right-8 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white text-xs font-medium text-slate-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Preview Mode Active
          </div>
        </div>
      </div>
    </main>
  );
}
