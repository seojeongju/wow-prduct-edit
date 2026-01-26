"use client";

import React, { useState, useRef, useEffect } from 'react';
import { removeBackground } from "@imgly/background-removal";
import { Download, Eraser, Image as ImageIcon, Check, Loader2, Undo, PaintBucket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store/useStore';
import { cn, downloadImage } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function ImageEditor() {
    const { productData, updateProductData, setStep, generateImage, isLoading } = useStore();
    const [activeTab, setActiveTab] = useState<'edit' | 'generate'>('edit');
    const [prompt, setPrompt] = useState('');

    // Only local state for edit processing
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedBg, setSelectedBg] = useState<string>('transparent');
    const [customColor, setCustomColor] = useState('#ffffff');

    // Determine the current image being viewed
    const currentImage = activeTab === 'edit' && processedImage ? processedImage : productData.imageUrl;

    // Background Options (Existing)
    const backgrounds = [
        { id: 'transparent', name: '투명', class: 'bg-[url(/grid.png)]', color: 'transparent' },
        { id: 'white', name: '화이트', class: 'bg-white', color: '#ffffff' },
        { id: 'gray', name: '라이트 그레이', class: 'bg-slate-100', color: '#f1f5f9' },
        { id: 'gradient-1', name: '모던 블루', class: 'bg-gradient-to-br from-blue-50 to-indigo-50', type: 'gradient' },
        { id: 'gradient-2', name: '소프트 핑크', class: 'bg-gradient-to-br from-rose-50 to-orange-50', type: 'gradient' },
    ];

    const handleRemoveBg = async () => {
        // (Existing Logic)
        if (!productData.imageUrl) return;
        setIsProcessing(true);
        try {
            const blob = await removeBackground(productData.imageUrl);
            const url = URL.createObjectURL(blob);
            setProcessedImage(url);
            updateProductData({ imageUrl: url });
        } catch (error) {
            console.error(error);
            alert("배경 제거 실패");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerate = async () => {
        if (!prompt) return alert("어떤 이미지를 만들지 설명해주세요.");
        // Call global store action (which handles loading state)
        await generateImage(prompt);
    };

    const applyBackground = (bg: typeof backgrounds[0]) => {
        setSelectedBg(bg.id);
    };

    const isBusy = isProcessing || isLoading;

    return (
        <div className="p-6 pb-32 space-y-8 w-full max-w-none mx-auto">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">이미지 스튜디오</h2>
                    <p className="text-sm text-slate-500">배경을 지우거나, AI로 새로운 이미지를 만들어보세요.</p>
                </div>
                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-lg">
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={cn("px-3 py-1.5 text-xs font-bold rounded-md transition-all", activeTab === 'edit' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                        편집 (배경 제거)
                    </button>
                    <button
                        onClick={() => setActiveTab('generate')}
                        className={cn("px-3 py-1.5 text-xs font-bold rounded-md transition-all", activeTab === 'generate' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                        AI 생성
                    </button>
                </div>
            </div>

            {/* Main Preview Area */}
            <div className="relative w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center group">
                {!currentImage ? (
                    <div className="text-slate-400 flex flex-col items-center">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm">이미지가 없습니다</span>
                    </div>
                ) : (
                    <>
                        {/* Background Layer (Only visible in edit mode) */}
                        <div className={cn(
                            "absolute inset-0 transition-colors duration-500",
                            backgrounds.find(b => b.id === selectedBg)?.class
                        )} style={activeTab === 'edit' && selectedBg === 'custom' ? { backgroundColor: customColor } : {}} />

                        {/* Image Layer */}
                        <img
                            src={currentImage}
                            alt="Product"
                            className="relative z-10 max-w-[80%] max-h-[80%] object-contain transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Floating Download Button */}
                        <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full shadow-lg bg-white/90 backdrop-blur"
                                onClick={() => downloadImage(currentImage, `wow-ai-detail-${Date.now()}.png`)}
                                title="이미지 다운로드"
                            >
                                <Download className="w-4 h-4 text-slate-700" />
                            </Button>
                        </div>
                    </>
                )}

                {isBusy && (
                    <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                        <p className="font-semibold text-indigo-900 animate-pulse">
                            {activeTab === 'edit' ? "AI 배경 제거 중..." : "AI 이미지 생성 중..."}
                        </p>
                    </div>
                )}
            </div>

            {/* Tools Section */}
            <div className="min-h-[200px]">
                {activeTab === 'edit' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Remove BG */}
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Eraser className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">배경 제거</h4>
                                    <p className="text-xs text-slate-500">원클릭 누끼 따기</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleRemoveBg}
                                disabled={isBusy || !!processedImage || !productData.imageUrl}
                                variant={processedImage ? "outline" : "default"}
                                size="sm"
                            >
                                {processedImage ? <><Check className="w-4 h-4 mr-1.5" /> 완료</> : "실행하기"}
                            </Button>
                        </div>

                        {/* Background Color */}
                        <div className="space-y-3">
                            <Label>배경 꾸미기</Label>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {backgrounds.map(bg => (
                                    <button
                                        key={bg.id}
                                        onClick={() => applyBackground(bg)}
                                        className={cn(
                                            "w-12 h-12 rounded-full border-2 flex-none transition-all",
                                            selectedBg === bg.id ? "border-indigo-600 scale-110" : "border-slate-200"
                                        )}
                                        style={bg.id === 'transparent' ? {} : { background: bg.color || '' }}
                                    >
                                        {bg.type === 'gradient' && <div className={`w-full h-full rounded-full ${bg.class}`} />}
                                    </button>
                                ))}
                                <div className="relative w-12 h-12 rounded-full border-2 border-slate-200 overflow-hidden">
                                    <input
                                        type="color"
                                        value={customColor}
                                        onChange={(e) => { setCustomColor(e.target.value); setSelectedBg('custom'); }}
                                        className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 p-0 border-0 cursor-pointer"
                                    />
                                    <PaintBucket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none mix-blend-difference text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="space-y-2">
                            <Label>어떤 이미지를 만들까요?</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="예: 햇살이 들어오는 따뜻한 거실 테이블 위의 커피잔"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    disabled={isBusy}
                                    className="bg-white"
                                />
                                <Button onClick={handleGenerate} disabled={isBusy || !prompt} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    생성
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-xl text-xs text-indigo-700 leading-relaxed">
                            💡 <strong>Tip:</strong> 구체적인 장소, 조명, 분위기를 설명할수록 더 좋은 결과가 나옵니다.
                            현재는 데모 모드로 예시 이미지가 생성됩니다. (API Key 설정 시 실제 작동)
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 w-full lg:w-[inherit] p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 z-20 flex gap-3">
                <Button variant="ghost" className="flex-1 h-12" onClick={() => { setProcessedImage(null); updateProductData({ imageUrl: null }); }}>
                    초기화
                </Button>
                <Button
                    className="flex-[2] h-12 bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10"
                    onClick={() => setStep(3)}
                    disabled={isBusy}
                >
                    다음 단계로 (디자인)
                </Button>
            </div>

        </div>
    );
}
