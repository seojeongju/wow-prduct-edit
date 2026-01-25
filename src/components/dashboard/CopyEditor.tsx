"use client";

import React from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CopyEditor() {
    const { productData, updateProductData, setStep, generateCopy, isLoading } = useStore();
    const content = productData.generatedContent;

    if (!content) return null;

    const handleUpdate = (key: keyof typeof content, value: string) => {
        updateProductData({
            generatedContent: {
                ...content,
                [key]: value
            }
        });
    };

    return (
        <div className="p-6 pb-32 space-y-8 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-bold">생성 완료</span>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">기획안 검토</h2>
                </div>
                <p className="text-sm text-slate-500">
                    AI가 제안한 문구를 확인하고, 원하는 대로 수정해보세요.
                </p>
            </div>

            <div className="space-y-6">

                {/* Section: Hook */}
                <div className="space-y-2 group">
                    <Label className="text-slate-900 font-semibold flex items-center gap-2">
                        📢 도입부 (Hook)
                        <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">고객의 시선을 끄는 첫 문장</span>
                    </Label>
                    <Textarea
                        value={content.hook}
                        onChange={(e) => handleUpdate('hook', e.target.value)}
                        className="min-h-[80px] bg-white border-slate-200 focus:border-indigo-500 text-slate-800 leading-relaxed resize-none shadow-sm group-hover:border-indigo-300 transition-colors"
                    />
                </div>

                {/* Section: Features */}
                <div className="space-y-2 group">
                    <Label className="text-slate-900 font-semibold flex items-center gap-2">
                        ✨ 핵심 특징 (Features)
                        <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">구매를 유도하는 강력한 근거</span>
                    </Label>
                    <Textarea
                        value={content.features}
                        onChange={(e) => handleUpdate('features', e.target.value)}
                        className="min-h-[160px] bg-white border-slate-200 focus:border-indigo-500 text-slate-800 leading-relaxed resize-none shadow-sm group-hover:border-indigo-300 transition-colors"
                    />
                </div>

                {/* Section: Trust & Closing */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2 group">
                        <Label className="text-slate-900 font-semibold">🤝 신뢰/리뷰 (Trust)</Label>
                        <Textarea
                            value={content.trust}
                            onChange={(e) => handleUpdate('trust', e.target.value)}
                            className="min-h-[80px] bg-white border-slate-200 focus:border-indigo-500 text-xs text-slate-600 resize-none shadow-sm"
                        />
                    </div>
                    <div className="space-y-2 group">
                        <Label className="text-slate-900 font-semibold">🔥 클로징 (Closing)</Label>
                        <Textarea
                            value={content.closing}
                            onChange={(e) => handleUpdate('closing', e.target.value)}
                            className="min-h-[80px] bg-white border-slate-200 focus:border-indigo-500 text-xs text-slate-600 resize-none shadow-sm"
                        />
                    </div>
                </div>

            </div>

            {/* Actions */}
            <div className="fixed bottom-0 left-0 w-full lg:w-[inherit] p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 z-20 flex gap-3">
                <Button
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={generateCopy}
                    disabled={isLoading}
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {isLoading ? "재생성 중..." : "다시 생성"}
                </Button>
                <Button
                    className="flex-[2] h-12 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/20"
                    onClick={() => setStep(2)}
                >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    확정하고 이미지 작업
                </Button>
            </div>

        </div>
    );
}
