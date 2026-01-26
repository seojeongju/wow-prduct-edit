"use client";

import React, { useState } from 'react';
import { Upload, Wand2, X, Plus, Info, Image as ImageIcon, Smile, Briefcase, Heart, Sparkles, ChevronRight, Hash } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductData } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductInputProps {
    data: ProductData;
    onChange: (data: ProductData) => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

export default function ProductInput({ data, onChange, onGenerate, isGenerating }: ProductInputProps) {
    const [dragActive, setDragActive] = useState(false);

    // Handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
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
        const url = URL.createObjectURL(file);
        onChange({ ...data, imageUrl: url });
    };

    const updateBenefit = (index: number, value: string) => {
        const newBenefits = [...data.benefits];
        newBenefits[index] = value;
        onChange({ ...data, benefits: newBenefits });
    };

    return (
        <div className="min-h-full bg-slate-50/50">
            {/* Header Section */}
            <div className="pt-10 px-8 pb-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        어떤 상품을 <span className="text-indigo-600">판매</span>하시나요?
                    </h1>
                    <p className="text-base text-slate-500 max-w-md">
                        AI가 상품 정보를 분석하여 1분 만에 구매 전환율 높은 상세페이지를 기획해드립니다.
                    </p>
                </motion.div>
            </div>

            <div className="px-8 pb-32 space-y-8 max-w-3xl">

                {/* 1. Basic Info Card */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group focus-within:ring-2 focus-within:ring-indigo-500/20"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Hash className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">기본 정보</h3>
                            <p className="text-xs text-slate-500">상품의 기초 데이터를 입력해주세요.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">상품명</Label>
                            <Input
                                placeholder="예: 무소음 탁상시계"
                                value={data.productName}
                                onChange={(e) => onChange({ ...data, productName: e.target.value })}
                                className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">타겟 고객</Label>
                            <Input
                                placeholder="예: 30대 직장인 여성"
                                value={data.targetAudience}
                                onChange={(e) => onChange({ ...data, targetAudience: e.target.value })}
                                className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>
                </motion.section>

                {/* 2. Key Benefits (USP) */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">핵심 장점</h3>
                            <p className="text-xs text-slate-500">고객이 이 상품을 사야 할 이유 3가지를 적어주세요.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {data.benefits.map((benefit, i) => (
                            <div key={i} className="relative flex items-center">
                                <span className="absolute left-4 font-mono text-sm font-bold text-indigo-300">0{i + 1}</span>
                                <Input
                                    value={benefit}
                                    onChange={(e) => updateBenefit(i, e.target.value)}
                                    className="pl-12 h-12 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all"
                                    placeholder={`장점 ${i + 1} (예: 100% 국내산 원료 사용)`}
                                />
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* 3. Image Upload (Large Area) */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div
                        className={cn(
                            "relative w-full aspect-[2/1] rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-3 group",
                            dragActive ? "border-indigo-500 bg-indigo-50/50" : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50",
                            data.imageUrl ? "border-none p-0 aspect-[16/9]" : ""
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => !data.imageUrl && document.getElementById('upload-box')?.click()}
                    >
                        <input type="file" className="hidden" id="upload-box" accept="image/*" onChange={handleChange} />

                        {data.imageUrl ? (
                            <div className="relative w-full h-full group">
                                <img src={data.imageUrl} alt="Uploaded" className="w-full h-full object-contain bg-slate-900" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                    <Button variant="secondary" onClick={(e) => { e.stopPropagation(); document.getElementById('upload-box')?.click(); }}>
                                        이미지 변경
                                    </Button>
                                    <Button
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                        onClick={(e) => { e.stopPropagation(); onChange({ ...data, imageUrl: null }); }}
                                    >
                                        삭제
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 rounded-full bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform shadow-sm">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-slate-700">대표 이미지를 올려주세요</p>
                                    <p className="text-xs text-slate-400 mt-1">드래그 앤 드롭 또는 클릭</p>
                                </div>
                            </>
                        )}
                    </div>
                </motion.section>


                {/* 4. Tone */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-3 gap-4"
                >
                    {[
                        { id: 'professional', label: '전문적인', desc: '신뢰감 있는', icon: Briefcase, color: "text-blue-600 bg-blue-50" },
                        { id: 'emotional', label: '감성적인', desc: '따뜻한 분위기', icon: Heart, color: "text-rose-600 bg-rose-50" },
                        { id: 'witty', label: '유쾌한', desc: '통통 튀는', icon: Smile, color: "text-amber-600 bg-amber-50" },
                    ].map((item) => {
                        const isSelected = data.tone === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onChange({ ...data, tone: item.id as any })}
                                className={cn(
                                    "relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-200 outline-none text-left hover:scale-[1.02]",
                                    isSelected
                                        ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-500"
                                        : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                                )}
                            >
                                <div className={cn("p-2.5 rounded-xl mb-3", item.color)}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={cn("text-sm font-bold", isSelected ? "text-indigo-900" : "text-slate-700")}>{item.label}</span>
                                <span className="text-xs text-slate-500 mt-0.5">{item.desc}</span>
                            </button>
                        )
                    })}
                </motion.section>

            </div>

            {/* Floating Action Button */}
            <div className="fixed lg:absolute bottom-0 left-0 w-full lg:w-[inherit] p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 z-20 flex justify-end">
                <Button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    size="lg"
                    className={cn(
                        "w-full h-14 text-lg font-bold rounded-xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]",
                        isGenerating ? "bg-slate-800" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    )}
                >
                    {isGenerating ? (
                        <>
                            <Wand2 className="w-5 h-5 mr-2 animate-spin text-indigo-300" />
                            <span className="animate-pulse">AI가 상세페이지 기획 중...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2 fill-white/20" />
                            상세페이지 생성하기
                            <ChevronRight className="w-5 h-5 ml-1" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
