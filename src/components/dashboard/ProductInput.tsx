"use client";

import React, { useState } from 'react';
import { Upload, Wand2, X, Plus, Info, Image as ImageIcon, Smile, Briefcase, Heart, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductData } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProductInputProps {
    data: ProductData;
    onChange: (data: ProductData) => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

export default function ProductInput({ data, onChange, onGenerate, isGenerating }: ProductInputProps) {
    const [dragActive, setDragActive] = useState(false);

    // Handlers (File/Drag)
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) handleFile(e.target.files[0]);
    };

    const handleFile = (file: File) => {
        // In production, use standard upload. Here utilize objectURL
        const url = URL.createObjectURL(file);
        onChange({ ...data, imageUrl: url });
    };

    const updateBenefit = (index: number, value: string) => {
        const newBenefits = [...data.benefits];
        newBenefits[index] = value;
        onChange({ ...data, benefits: newBenefits });
    };

    return (
        <div className="p-6 pb-32 space-y-8 max-w-xl mx-auto">

            {/* Intro Section */}
            <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">상품 정보 입력</h2>
                <p className="text-sm text-slate-500">
                    AI가 매력적인 상세페이지를 완성할 수 있도록 핵심 정보를 알려주세요.
                </p>
            </div>

            <div className="space-y-8">
                {/* Section 1: Basic Info */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">1</span>
                        <h3 className="font-semibold text-slate-900">기본 정보</h3>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">상품명</Label>
                            <Input
                                placeholder="예: 프리미엄 무소음 탁상시계"
                                value={data.productName}
                                onChange={(e) => onChange({ ...data, productName: e.target.value })}
                                className="font-medium text-lg border-transparent bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all shadow-inner"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">타겟 고객</Label>
                            <Input
                                placeholder="예: 인테리어에 관심 많은 30대 신혼부부"
                                value={data.targetAudience}
                                onChange={(e) => onChange({ ...data, targetAudience: e.target.value })}
                                className="border-slate-200 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: Image */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">2</span>
                        <h3 className="font-semibold text-slate-900">대표 이미지</h3>
                    </div>

                    <div className="group relative">
                        <div
                            className={cn(
                                "relative flex flex-col items-center justify-center w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
                                dragActive ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300",
                                data.imageUrl ? "border-none bg-black" : ""
                            )}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input type="file" className="hidden" id="upload-box" accept="image/*" onChange={handleChange} />

                            {data.imageUrl ? (
                                <>
                                    <img src={data.imageUrl} alt="Uploaded" className="w-full h-full object-contain" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                        <Button size="sm" variant="secondary" onClick={(e) => { e.preventDefault(); document.getElementById('upload-box')?.click(); }}>변경</Button>
                                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white border-none" onClick={(e) => { e.preventDefault(); onChange({ ...data, imageUrl: null }); }}>삭제</Button>
                                    </div>
                                </>
                            ) : (
                                <label htmlFor="upload-box" className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-6 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-lg shadow-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <ImageIcon className="w-8 h-8 text-indigo-500" />
                                    </div>
                                    <p className="font-semibold text-slate-700">이미지 업로드</p>
                                    <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                                        이미지를 이곳에 드래그하거나<br />클릭해서 업로드하세요
                                    </p>
                                </label>
                            )}
                        </div>
                    </div>
                </section>

                {/* Section 3: Benefits (USP) */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">3</span>
                        <h3 className="font-semibold text-slate-900">핵심 장점 3가지</h3>
                    </div>

                    <div className="space-y-3">
                        {data.benefits.map((benefit, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md bg-indigo-50 text-indigo-600 text-xs font-bold font-mono">
                                    {i + 1}
                                </div>
                                <Input
                                    value={benefit}
                                    onChange={(e) => updateBenefit(i, e.target.value)}
                                    className="pl-12 py-6 border-slate-200 focus:border-indigo-500 shadow-sm transition-all focus:ring-4 focus:ring-indigo-100"
                                    placeholder={`장점 ${i + 1} 입력 (예: 국내 유일 100% 방수)`}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 4: Tone */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">4</span>
                        <h3 className="font-semibold text-slate-900">문구 스타일</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'professional', label: '전문적인', icon: Briefcase, color: "text-blue-500 bg-blue-50" },
                            { id: 'emotional', label: '감성적인', icon: Heart, color: "text-rose-500 bg-rose-50" },
                            { id: 'witty', label: '유쾌한', icon: Smile, color: "text-amber-500 bg-amber-50" },
                        ].map((item) => {
                            const isSelected = data.tone === item.id;
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onChange({ ...data, tone: item.id as any })}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 outline-none",
                                        isSelected
                                            ? "border-indigo-600 bg-indigo-50/30 text-indigo-900 shadow-lg shadow-indigo-500/10"
                                            : "border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                    )}
                                >
                                    <div className={cn("p-2 rounded-full transition-transform duration-300", item.color, isSelected && "scale-110")}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-semibold">{item.label}</span>
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </section>

            </div>

            {/* Floating Action Button area */}
            <div className="fixed lg:absolute bottom-0 left-0 w-full lg:w-[inherit] p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 z-20">
                <Button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className={cn(
                        "w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]",
                        isGenerating ? "bg-slate-800" : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
                    )}
                >
                    {isGenerating ? (
                        <>
                            <Wand2 className="w-5 h-5 mr-2 animate-spin text-indigo-300" />
                            <span className="animate-pulse">AI가 제작 중입니다...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2 fill-white/20" />
                            상세페이지 생성하기
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
