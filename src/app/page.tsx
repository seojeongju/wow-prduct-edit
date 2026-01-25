import React, { useState } from 'react';
import ProductInput from '@/components/dashboard/ProductInput';
import DevicePreview from '@/components/preview/DevicePreview'; // Updated Import
import { ProductData } from '@/types';
import { Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import ImageEditor from '@/components/dashboard/ImageEditor';
import CopyEditor from '@/components/dashboard/CopyEditor';
import LayoutEditor from '@/components/dashboard/LayoutEditor';

export default function Home() {
  const { currentStep, setStep, productData, updateProductData, isLoading, setLoading, generateCopy } = useStore();

  // Steps definition for UI
  const steps = [
    { id: 1, label: "기획/카피", desc: "상품 정보 입력" },
    { id: 2, label: "이미지", desc: "업로드 및 편집" },
    { id: 3, label: "디자인", desc: "레이아웃 설정" },
    { id: 4, label: "완성", desc: "내보내기" },
  ];

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
          <span className="font-bold text-slate-900">Smart Detail</span>
        </div>

        {/* Stepper (Desktop) */}
        <div className="hidden lg:flex items-center gap-1">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isComplete = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                                ${isActive ? "bg-indigo-50 ring-1 ring-indigo-500/20" : "opacity-60"}
                                ${isComplete ? "text-indigo-600" : "text-slate-600"}
                            `}
                >
                  <div className={`
                                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                                ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : ""}
                                ${isComplete ? "bg-indigo-100 text-indigo-600" : ""}
                                ${!isActive && !isComplete ? "bg-slate-200 text-slate-500" : ""}
                            `}>
                    {isComplete ? "✓" : step.id}
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className={`text-sm font-semibold ${isActive ? "text-indigo-900" : ""}`}>{step.label}</span>
                    {isActive && <span className="text-[10px] text-slate-500 mt-0.5">{step.desc}</span>}
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-8 h-[1px] ${isComplete ? "bg-indigo-200" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Simple User Profile or Actions */}
          <div className="w-8 h-8 rounded-full bg-slate-200" />
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden z-10 relative">

        {/* Left Panel: Dynamic Content based on Step */}
        <div className="w-full lg:w-[500px] flex-none h-full overflow-y-auto scrollbar-hide border-r border-slate-200/60 bg-white/40 backdrop-blur-3xl transition-all">

          {currentStep === 1 && (
            !productData.generatedContent ? (
              <ProductInput
                data={productData}
                onChange={updateProductData}
                onGenerate={generateCopy}
                isGenerating={isLoading}
              />
            ) : (
              <CopyEditor />
            )
          )}

          {currentStep === 2 && (
            <ImageEditor />
          )}

          {currentStep === 3 && (
            <LayoutEditor />
          )}

          {currentStep > 3 && (
            <div className="p-10 flex flex-col items-center justify-center h-full text-center space-y-4">
              {/* Final Step Logic (Coming Soon) */}
              <h2 className="text-xl font-bold">완성 (Step 4)</h2>
              <p className="text-slate-500">곧 구현될 예정입니다.</p>
            </div>
          )}

        </div>

        {/* Right Panel: Preview Studio */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-100/50 relative overflow-hidden">
          <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
            <DevicePreview data={productData} isLoading={isLoading} />
          </div>

          {/* Global Next/Prev Navigation for Demo */}
          <div className="absolute bottom-8 right-8 flex gap-2 z-20">
            <Button
              variant="ghost"
              onClick={() => setStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              이전
            </Button>
            <Button
              className="bg-slate-900 text-white"
              onClick={() => {
                if (currentStep === 4) {
                  alert("최종 완성! HTML 추출 기능을 준비중입니다.");
                } else {
                  setStep(Math.min(4, currentStep + 1));
                }
              }}
            >
              {currentStep === 4 ? "다운로드" : `다음 단계 (${currentStep + 1}/4)`}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
