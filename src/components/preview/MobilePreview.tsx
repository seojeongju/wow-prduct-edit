"use client";

import React from 'react';
import { ProductData } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, MessageCircle } from 'lucide-react';

interface MobilePreviewProps {
    data: ProductData;
    isLoading: boolean;
}

export default function MobilePreview({ data, isLoading }: MobilePreviewProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-neutral-100 h-full min-h-screen sticky top-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-6 text-neutral-400 font-medium text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Mobile Preview
            </div>

            {/* Phone Frame */}
            <div className="relative w-[375px] h-[812px] bg-white rounded-[50px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border-8 border-neutral-900 overflow-hidden flex flex-col">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-neutral-900 rounded-b-2xl z-20"></div>

                {/* Header / Nav */}
                <div className="flex-none bg-white/80 backdrop-blur-md px-4 h-24 flex items-end pb-3 justify-between border-b border-neutral-100 z-10">
                    <span className="font-bold text-lg">SmartStore</span>
                    <div className="flex gap-3">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                </div>

                {/* Screen Content */}
                <div className="flex-1 w-full overflow-y-auto scrollbar-hide bg-white pb-20">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-[600px] gap-4"
                            >
                                <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                                <p className="text-neutral-500 font-medium animate-pulse">AI가 상세페이지를 디자인 중입니다...</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col"
                            >
                                {/* Product Image */}
                                <div className="relative w-full aspect-square bg-neutral-100">
                                    {data.imageUrl ? (
                                        <img src={data.imageUrl} alt="Product" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                            이미지 없음
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                                        1/5
                                    </div>
                                </div>

                                {/* Product Info Header */}
                                <div className="p-5 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <h1 className="text-xl font-bold leading-tight break-keep">
                                            {data.productName || "상품명을 입력해주세요"}
                                        </h1>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-neutral-500">
                                        <span className="text-red-500 font-bold">15%</span>
                                        <span className="line-through">59,000원</span>
                                        <span className="text-black font-bold text-lg ml-1">49,900원</span>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <span className="px-2 py-1 bg-neutral-100 rounded text-neutral-600">무료배송</span>
                                        <span className="px-2 py-1 bg-neutral-100 rounded text-neutral-600">내일도착</span>
                                    </div>
                                </div>

                                <div className="h-2 bg-neutral-50" />

                                {/* AI Content Section - The Main Detail Page */}
                                <div className="p-0">
                                    {/* Hook / Intro */}
                                    <div className="px-6 py-12 bg-gradient-to-b from-blue-50 to-white text-center space-y-4">
                                        {data.generatedContent?.hook ? (
                                            <>
                                                <p className="text-blue-600 font-bold tracking-widest text-sm">CHECK POINT</p>
                                                <h2 className="text-2xl font-bold leading-snug whitespace-pre-line">
                                                    {data.generatedContent.hook}
                                                </h2>
                                            </>
                                        ) : (
                                            <div className="space-y-2 opacity-30">
                                                <div className="h-4 bg-black/10 rounded w-20 mx-auto" />
                                                <div className="h-6 bg-black/10 rounded w-3/4 mx-auto" />
                                                <div className="h-6 bg-black/10 rounded w-1/2 mx-auto" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Benefits */}
                                    <div className="px-5 py-10 space-y-10">
                                        {data.benefits.filter(Boolean).map((benefit, i) => (
                                            <div key={i} className="flex flex-col gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/30">
                                                    0{i + 1}
                                                </div>
                                                <h3 className="text-lg font-bold">{benefit}</h3>
                                                <p className="text-neutral-600 leading-relaxed text-sm">
                                                    {data.generatedContent?.features
                                                        ? "AI가 생성한 상세 설명이 이곳에 들어갑니다. " + benefit + "에 대한 구체적인 근거와 고객 혜택을 자연스럽게 풀어냅니다."
                                                        : "상품의 장점을 입력하면 AI가 설득력 있는 문장으로 확장해줍니다."}
                                                </p>
                                                <div className="w-full h-48 bg-neutral-100 rounded-2xl mt-2 overflow-hidden relative">
                                                    {data.imageUrl && <img src={data.imageUrl} className="w-full h-full object-cover opacity-80" />}
                                                </div>
                                            </div>
                                        ))}
                                        {data.benefits.filter(Boolean).length === 0 && (
                                            <div className="text-center text-neutral-300 py-10">
                                                핵심 장점을 입력해주세요
                                            </div>
                                        )}
                                    </div>

                                    {/* Trust Section */}
                                    <div className="bg-neutral-900 text-white px-6 py-12 text-center">
                                        <div className="flex justify-center gap-1 mb-4 text-yellow-400">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">고객 만족도 4.9점</h3>
                                        <p className="text-neutral-400 text-sm whitespace-pre-line">
                                            {data.generatedContent?.trust || "실제 사용해보신 분들의 극찬이 쏟아집니다.\n믿고 구매하셔도 좋습니다."}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex-none h-16 bg-white border-t border-neutral-100 flex items-center px-4">
                    <div className="flex-1 flex gap-2">
                        <button className="flex-none p-2 border rounded-md">
                            <MessageCircle className="w-6 h-6" />
                        </button>
                        <button className="flex-1 bg-blue-600 text-white rounded-md font-bold text-lg shadow-lg shadow-blue-500/30">
                            구매하기
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
