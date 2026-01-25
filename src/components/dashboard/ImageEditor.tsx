"use client";

import React, { useState, useRef, useEffect } from 'react';
import { removeBackground } from "@imgly/background-removal";
import { Download, Eraser, Image as ImageIcon, Check, Loader2, Undo, PaintBucket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function ImageEditor() {
    const { productData, updateProductData, nextStep } = useStore();
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedBg, setSelectedBg] = useState<string>('transparent');
    const [customColor, setCustomColor] = useState('#ffffff');

    // Background Options
    const backgrounds = [
        { id: 'transparent', name: '투명', class: 'bg-[url(/grid.png)]', color: 'transparent' },
        { id: 'white', name: '화이트', class: 'bg-white', color: '#ffffff' },
        { id: 'gray', name: '라이트 그레이', class: 'bg-slate-100', color: '#f1f5f9' },
        { id: 'gradient-1', name: '모던 블루', class: 'bg-gradient-to-br from-blue-50 to-indigo-50', type: 'gradient' },
        { id: 'gradient-2', name: '소프트 핑크', class: 'bg-gradient-to-br from-rose-50 to-orange-50', type: 'gradient' },
    ];

    const handleRemoveBg = async () => {
        if (!productData.imageUrl) return;

        setIsProcessing(true);
        try {
            // Use imgly to remove background directly in browser
            const blob = await removeBackground(productData.imageUrl);
            const url = URL.createObjectURL(blob);
            setProcessedImage(url);

            // Update global store with processed image
            updateProductData({ imageUrl: url });

        } catch (error) {
            console.error("Background removal failed:", error);
            alert("배경 제거에 실패했습니다. 다른 이미지를 시도해보세요.");
        } finally {
            setIsProcessing(false);
        }
    };

    const applyBackground = (bg: typeof backgrounds[0]) => {
        setSelectedBg(bg.id);
        // 만약 캔버스 합성이 필요하다면 여기서 로직 처리
        // 현재는 CSS로만 시각적 표현
    };

    return (
        <div className="p-6 pb-32 space-y-8 max-w-xl mx-auto">
            <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">이미지 스튜디오</h2>
                <p className="text-sm text-slate-500">
                    상품의 배경을 정리하고 깔끔하게 연출해보세요.
                </p>
            </div>

            {/* Main Preview Area */}
            <div className="relative w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center group">
                {!productData.imageUrl ? (
                    <div className="text-slate-400 flex flex-col items-center">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm">이미지가 없습니다</span>
                    </div>
                ) : (
                    <>
                        {/* Background Layer */}
                        <div className={cn(
                            "absolute inset-0 transition-colors duration-500",
                            backgrounds.find(b => b.id === selectedBg)?.class
                        )} style={selectedBg === 'custom' ? { backgroundColor: customColor } : {}} />

                        {/* Image Layer */}
                        <img
                            src={processedImage || productData.imageUrl}
                            alt="Product"
                            className="relative z-10 max-w-[80%] max-h-[80%] object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                    </>
                )}

                {isProcessing && (
                    <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                        <div className="w-16 h-16 relative">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="mt-4 font-semibold text-indigo-900 animate-pulse">AI 배경 제거 중...</p>
                        <p className="text-xs text-slate-500 mt-1">최대 5~10초 소요됩니다</p>
                    </div>
                )}
            </div>

            {/* Tools Section */}
            <div className="space-y-6">

                {/* Action 1: Remove BG */}
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Eraser className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">배경 제거</h4>
                            <p className="text-xs text-slate-500">지저분한 배경을 자동으로 삭제</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleRemoveBg}
                        disabled={isProcessing || !!processedImage}
                        variant={processedImage ? "outline" : "default"}
                        size="sm"
                    >
                        {processedImage ? (
                            <>
                                <Check className="w-4 h-4 mr-1.5" /> 완료됨
                            </>
                        ) : (
                            "실행하기"
                        )}
                    </Button>
                </div>

                {/* Action 2: Background Color */}
                <div className="space-y-3">
                    <Label>배경 선택</Label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {backgrounds.map(bg => (
                            <button
                                key={bg.id}
                                onClick={() => applyBackground(bg)}
                                className={cn(
                                    "w-12 h-12 rounded-full border-2 flex-none transition-all shadow-sm",
                                    selectedBg === bg.id ? "border-indigo-600 scale-110 ring-2 ring-indigo-100" : "border-slate-200 hover:scale-105",
                                    bg.class
                                )}
                                title={bg.name}
                            />
                        ))}

                        {/* Custom Color Picker */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                                <input
                                    type="color"
                                    value={customColor}
                                    onChange={(e) => {
                                        setCustomColor(e.target.value);
                                        setSelectedBg('custom');
                                    }}
                                    className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 p-0 border-0 cursor-pointer"
                                />
                                <PaintBucket className="w-4 h-4 text-slate-500 pointer-events-none sticky z-10 mix-blend-difference text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 w-full lg:w-[inherit] p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 z-20 flex gap-3">
                <Button variant="outline" className="flex-1 h-12" onClick={() => setProcessedImage(null)}>
                    <Undo className="w-4 h-4 mr-2" /> 초기화
                </Button>
                <Button
                    className="flex-[2] h-12 bg-slate-900 text-white hover:bg-slate-800"
                    onClick={nextStep}
                >
                    다음 단계로
                </Button>
            </div>

        </div>
    );
}
