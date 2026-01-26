"use client";

import React, { useState, useEffect } from 'react';
import ProductInput from '@/components/dashboard/ProductInput';
import DevicePreview from '@/components/preview/DevicePreview';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import ImageEditor from '@/components/dashboard/ImageEditor';
import CopyEditor from '@/components/dashboard/CopyEditor';
import LayoutEditor from '@/components/dashboard/LayoutEditor';
import ExportPanel from '@/components/dashboard/ExportPanel';
import Logo from '@/components/ui/Logo';

function EditorContent() {
  const { currentStep, setStep, productData, updateProductData, isLoading, setLoading, generateCopy } = useStore();

  const steps = [
    { id: 1, label: "기획", desc: "정보 입력" },
    { id: 2, label: "이미지", desc: "편집/보정" },
    { id: 3, label: "디자인", desc: "레이아웃" },
    { id: 4, label: "완성", desc: "확인 및 저장" },
  ];

  return (
    <main className="h-screen w-full flex flex-col overflow-hidden bg-slate-50 relative font-sans selection:bg-primary/20 selection:text-primary">

      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <header className="flex-none h-16 px-6 lg:px-8 flex items-center justify-between z-30 glass-nav">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
            W
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">
            WOW <span className="text-indigo-600">Smart Design</span>
          </span>
        </div>

        {/* Desktop Stepper */}
        <div className="hidden lg:flex items-center bg-slate-100/50 p-1 rounded-full border border-slate-200/50 backdrop-blur-sm">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isComplete = currentStep > step.id;

            return (
              <button
                key={step.id}
                onClick={() => isComplete && setStep(step.id)}
                disabled={!isComplete && !isActive}
                className={`
                  relative px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive ? "bg-white text-indigo-700 shadow-sm ring-1 ring-black/5" : "text-slate-500 hover:text-slate-700"}
                  ${isComplete ? "text-slate-900" : ""}
                `}
              >
                {step.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="w-8" /> {/* Spacer for balance */}
      </header>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden z-20 relative">

        {/* Left Panel: Editor */}
        <div className="w-full lg:w-[680px] flex-none h-full overflow-y-auto scrollbar-hide border-r border-slate-200/60 bg-white/60 backdrop-blur-xl transition-all shadow-xl shadow-slate-200/20 z-20">
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
          {currentStep === 2 && <ImageEditor />}
          {currentStep === 3 && <LayoutEditor />}
          {currentStep === 4 && <ExportPanel />}
        </div>

        {/* Right Panel: Preview */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-50/30 relative overflow-hidden">

          {/* Background Grid Pattern inside Preview Area */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.6] pointer-events-none" />

          <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
            <DevicePreview data={productData} isLoading={isLoading} />
          </div>

          {/* Floating Navigation Controls */}
          {currentStep < 4 && (
            <div className="absolute bottom-8 right-8 flex gap-3 z-30">
              <Button
                variant="ghost"
                size="lg"
                className="bg-white/80 backdrop-blur hover:bg-white border border-slate-200 shadow-sm text-slate-600"
                onClick={() => setStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                이전
              </Button>
              <Button
                size="lg"
                className="bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 transition-all"
                onClick={() => setStep(Math.min(4, currentStep + 1))}
              >
                다음 단계 <span className="ml-2 opacity-60">({currentStep + 1}/4)</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    useStore.persist.rehydrate();
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) return null;

  return <EditorContent />;
}
