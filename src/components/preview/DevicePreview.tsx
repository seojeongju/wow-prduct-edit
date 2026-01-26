"use client";

import React, { useState } from 'react';
import { ProductData } from '@/types';
import { Loader2, Smartphone, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DevicePreviewProps {
    data: ProductData;
    isLoading: boolean;
}

export default function DevicePreview({ data, isLoading }: DevicePreviewProps) {
    const [viewMode, setViewMode] = useState<'mobile' | 'pc'>('mobile');

    // Updated renderBlock to be much more premium
    const renderBlock = (blockId: string, config: any) => {
        const content = data.generatedContent;
        if (!content && blockId !== 'image') return null;

        const primaryColor = config.primaryColor || '#4f46e5';
        const backgroundColor = config.backgroundColor || '#ffffff';
        const textColor = '#1e293b';

        switch (blockId) {
            case 'hook':
                return (
                    <section
                        className="py-20 px-8 text-white text-center relative overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, ${textColor} 0%, #334155 100%)`
                        }}
                    >
                        {/* Subtle Background Pattern */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter leading-[1.1] whitespace-pre-line mb-4 italic">
                                {content?.hook}
                            </h2>
                            <div className="w-12 h-1 bg-white/30 mx-auto rounded-full" />
                        </motion.div>
                    </section>
                );
            case 'image':
                if (!data.imageUrl) return null;
                return (
                    <div className="w-full relative bg-white py-12 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-slate-50/50" />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10 w-[85%] aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white group"
                        >
                            <img
                                src={data.imageUrl}
                                alt="Product"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </motion.div>
                    </div>
                );
            case 'features':
                return (
                    <section className="py-16 px-8" style={{ backgroundColor }}>
                        <div className="text-center mb-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block" style={{ color: primaryColor }}>Main Benefits</span>
                            <h3 className="text-2xl font-bold tracking-tight" style={{ color: textColor }}>
                                오직 당신을 위해 <br /> 준비된 <span style={{ color: primaryColor }}>3가지 핵심 경험</span>
                            </h3>
                        </div>
                        <div className="space-y-6">
                            {content?.features?.split('\n').filter(line => line.trim()).map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15 }}
                                    className="p-5 rounded-2xl border bg-white shadow-sm border-slate-100 flex gap-4 items-start group hover:border-indigo-200 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-none font-bold text-sm bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        {idx + 1}
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed text-slate-600 whitespace-pre-line">
                                        {feature.replace(/^[0-9.]\s?/, '')}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                );
            case 'trust':
                return (
                    <section className="py-16 px-8 text-center relative overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        <div className="flex justify-center gap-1 mb-6">
                            {[1, 2, 3, 4, 5].map(s => (
                                <svg key={s} className="w-5 h-5 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                        </div>
                        <blockquote className="text-xl font-medium italic tracking-tight mb-4 px-4 line-clamp-3" style={{ color: '#334155' }}>
                            &quot;{content?.trust?.split('\n')[0]}&quot;
                        </blockquote>
                        <p className="text-sm text-slate-400 font-bold tracking-widest uppercase">Verified Customer Review</p>
                    </section>
                );
            case 'closing':
                return (
                    <section
                        className="py-16 px-8 text-white text-center relative"
                        style={{
                            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-black mb-6 whitespace-pre-line tracking-tight px-2">{content?.closing}</h3>
                            <button
                                className="w-full py-5 bg-white rounded-2xl font-black shadow-2xl hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2"
                                style={{ color: primaryColor }}
                            >
                                지금 혜택 받기
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                            </button>
                            <p className="mt-4 text-[10px] opacity-60 font-medium">실시간 주문 폭주! 재고 소진 임박</p>
                        </motion.div>
                    </section>
                );
            default:
                return null;
        }
    };

    const layoutOrder = data.layoutOrder || ['hook', 'image', 'features', 'trust', 'closing'];

    const styleConfig = data.styleConfig || { font: 'pretendard', primaryColor: '#4f46e5', backgroundColor: '#ffffff' };

    const getFontFamily = (font: string) => {
        switch (font) {
            case 'chosun': return '"Noto Serif KR", serif'; // Fallback to Noto Serif
            case 'gmarket': return '"Black Han Sans", sans-serif'; // Fallback to Black Han Sans for impact
            default: return '"Pretendard", "Inter", sans-serif';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full relative">
            {/* Inject Fonts for Preview (Demo Purpose) */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Noto+Serif+KR:wght@400;700&display=swap');
            `}</style>

            {/* Toggle Switch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/50 backdrop-blur-md p-1 rounded-full border border-white/40 shadow-sm flex z-50">
                <button
                    onClick={() => setViewMode('mobile')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
                        viewMode === 'mobile' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:bg-white/50"
                    )}
                >
                    <Smartphone className="w-4 h-4" /> Mobile
                </button>
                <button
                    onClick={() => setViewMode('pc')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
                        viewMode === 'pc' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:bg-white/50"
                    )}
                >
                    <Monitor className="w-4 h-4" /> PC View
                </button>
            </div>

            {/* Preview Container */}
            <motion.div
                layout
                initial={false}
                animate={{
                    width: viewMode === 'mobile' ? 375 : (data.canvasSize?.width || '90%'),
                    height: viewMode === 'mobile' ? 680 : '85%',
                    borderRadius: viewMode === 'mobile' ? 32 : 12,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className={cn(
                    "relative shadow-2xl border-4 border-slate-900/10 overflow-hidden flex flex-col transition-all duration-300",
                    viewMode === 'mobile' ? "border-slate-800" : "border-slate-200"
                )}
                style={{
                    maxWidth: viewMode === 'mobile' ? '100%' : '100%',
                    backgroundColor: styleConfig.backgroundColor,
                    fontFamily: getFontFamily(styleConfig.font)
                }}
            >
                {/* Browser/Phone Header Bar */}
                <div className={cn(
                    "h-6 w-full flex items-center px-4 gap-1.5 z-10",
                    viewMode === 'mobile' ? "bg-slate-800 justify-center" : "bg-slate-100 justify-start border-b"
                )}>
                    {viewMode === 'mobile' ? (
                        <div className="w-20 h-4 bg-black rounded-b-xl" /> /* Notch */
                    ) : (
                        <>
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        </>
                    )}
                </div>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto scrollbar-hide relative" style={{ backgroundColor: styleConfig.backgroundColor }}>
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-8 h-8 animate-spin" style={{ color: styleConfig.primaryColor }} />
                            <p className="text-sm font-medium text-slate-400 animate-pulse">AI가 제작 중입니다...</p>
                        </div>
                    ) : (
                        <div id="preview-capture-area" className="flex flex-col min-h-full" style={{ backgroundColor: styleConfig.backgroundColor }}>
                            {/* Render blocks in order */}
                            {layoutOrder.map((blockId) => (
                                <React.Fragment key={blockId}>
                                    {renderBlock(blockId, styleConfig)}
                                </React.Fragment>
                            ))}

                            {/* Footer info */}
                            <div className="p-8 text-center text-slate-300 text-[10px]" style={{ backgroundColor: styleConfig.backgroundColor, filter: 'brightness(95%)' }}>
                                Designed by WOW AI Smart Detail
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
