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
      <header className="flex-none h-20 px-6 lg:px-10 flex items-center justify-between z-20 border-b border-slate-200/60 bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Logo className="h-16 w-auto" />
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
          <div className="w-8 h-8 rounded-full bg-slate-200" />
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden z-10 relative">
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

          {currentStep === 4 && (
            <ExportPanel />
          )}
        </div>

        <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-100/50 relative overflow-hidden">
          <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
            <DevicePreview data={productData} isLoading={isLoading} />
          </div>

          {currentStep < 4 && (
            <div className="absolute bottom-8 right-8 flex gap-2 z-20">
              <Button
                variant="ghost"
                onClick={() => setStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                이전
              </Button>
              <Button
                className="bg-slate-900 text-white shadow-lg"
                onClick={() => setStep(Math.min(4, currentStep + 1))}
              >
                다음 단계 ({currentStep + 1}/4)
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
