"use client";

import React, { useState } from 'react';
import { Upload, Wand2, X, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ProductData } from '@/types';
import { motion } from 'framer-motion';

interface ProductInputProps {
    data: ProductData;
    onChange: (data: ProductData) => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

export default function ProductInput({ data, onChange, onGenerate, isGenerating }: ProductInputProps) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        // In a real app, upload to server/S3. Here we use object URL for preview.
        const url = URL.createObjectURL(file);
        onChange({ ...data, imageUrl: url });
    };

    const updateBenefit = (index: number, value: string) => {
        const newBenefits = [...data.benefits];
        newBenefits[index] = value;
        onChange({ ...data, benefits: newBenefits });
    };

    return (
        <div className="space-y-8 p-6 pb-24">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">상품 정보 입력</h2>
                <p className="text-neutral-500">AI가 매력적인 상세페이지를 만들 수 있도록 정보를 알려주세요.</p>
            </div>

            <div className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                    <Label>대표 상품 이미지</Label>
                    <div
                        className={`relative flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
              ${dragActive ? "border-blue-500 bg-blue-50/50" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100"}
              ${data.imageUrl ? "border-none" : ""}
            `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input type="file" className="hidden" id="image-upload" accept="image/*" onChange={handleChange} />

                        {data.imageUrl ? (
                            <div className="relative w-full h-full group">
                                <img src={data.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onChange({ ...data, imageUrl: null });
                                        }}
                                    >
                                        <X className="w-4 h-4 mr-2" /> 이미지 제거
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                <div className="p-4 rounded-full bg-white shadow-sm mb-4">
                                    <Upload className="w-6 h-6 text-blue-600" />
                                </div>
                                <p className="mb-2 text-sm text-neutral-900 font-medium">클릭하여 업로드 또는 드래그</p>
                                <p className="text-xs text-neutral-500">PNG, JPG up to 10MB</p>
                            </label>
                        )}
                    </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="productName">상품명</Label>
                        <Input
                            id="productName"
                            placeholder="예: 프리미엄 무소음 탁상시계"
                            value={data.productName}
                            onChange={(e) => onChange({ ...data, productName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="targetAudience">타겟 고객 (메인 타겟)</Label>
                        <Input
                            id="targetAudience"
                            placeholder="예: 2030 자취생, 인테리어 관심 많은 신혼부부"
                            value={data.targetAudience}
                            onChange={(e) => onChange({ ...data, targetAudience: e.target.value })}
                        />
                    </div>
                </div>

                {/* USPs */}
                <div className="space-y-3">
                    <Label>핵심 장점 3가지 (USP)</Label>
                    {data.benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                            <div className="flex items-center justify-center w-8 h-12 text-sm font-bold text-neutral-300">
                                {index + 1}
                            </div>
                            <Input
                                placeholder={`장점 ${index + 1} (예: 도서관보다 조용한 무소음 무브먼트)`}
                                value={benefit}
                                onChange={(e) => updateBenefit(index, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                {/* Tone */}
                <div className="space-y-2">
                    <Label>문구 톤앤매너</Label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'professional', label: '신뢰감 있는', desc: '전문적이고 분석적인' },
                            { id: 'emotional', label: '감성적인', desc: '따뜻하고 공감가는' },
                            { id: 'witty', label: '유머러스한', desc: '재치있고 친근한' }
                        ].map((tone) => (
                            <div
                                key={tone.id}
                                onClick={() => onChange({ ...data, tone: tone.id as any })}
                                className={`cursor-pointer rounded-lg border p-4 transition-all hover:bg-neutral-50
                    ${data.tone === tone.id
                                        ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                                        : "border-neutral-200"
                                    }`}
                            >
                                <div className="font-medium text-sm mb-1">{tone.label}</div>
                                <div className="text-xs text-neutral-500">{tone.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full lg:w-1/2 p-6 bg-white/80 backdrop-blur-md border-t border-neutral-200 z-10">
                <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
                    onClick={onGenerate}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <Wand2 className="w-5 h-5 mr-2 animate-spin" />
                            AI 상세페이지 생성 중...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-5 h-5 mr-2" />
                            AI 상세페이지 생성하기
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
