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

    // Updated renderBlock to accept style config
    const renderBlock = (blockId: string, config: any) => {
        const content = data.generatedContent;
        if (!content && blockId !== 'image') return null;

        // Use config for dynamic coloring
        const primaryColor = config.primaryColor || '#4f46e5';
        // Calculate a text color that contrasts well (Keep simple for now: Dark for light bg)
        const textColor = '#1e293b';

        switch (blockId) {
            case 'hook':
                return (
                    <section className="py-12 px-6 text-white text-center" style={{ backgroundColor: '#1e293b' }}>
                        {/* Note: Hook is usually dark for impact, regardless of theme */}
                        <h2 className="text-2xl font-bold leading-tight whitespace-pre-line">{content?.hook}</h2>
                    </section>
                );
            case 'image':
                if (!data.imageUrl) return null;
                return (
                    <div className="w-full aspect-square bg-slate-100 relative">
                        <img src={data.imageUrl} alt="Product" className="w-full h-full object-cover" />
                    </div>
                );
            case 'features':
                return (
                    <section className="py-10 px-6">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2" style={{ color: textColor, borderColor: primaryColor }}>Why This Product?</h3>
                        <div className="space-y-4 whitespace-pre-line leading-relaxed" style={{ color: '#475569' }}>
                            {content?.features}
                        </div>
                    </section>
                );
            case 'trust':
                return (
                    <section className="py-8 px-6 text-center border-y" style={{ borderColor: `${primaryColor}20`, backgroundColor: `${config.backgroundColor}` }}>
                        <div className="text-lg mb-2" style={{ color: primaryColor }}>★★★★★</div>
                        <p className="font-medium whitespace-pre-line" style={{ color: textColor }}>&quot;{content?.trust}&quot;</p>
                    </section>
                );
            case 'closing':
                return (
                    <section className="py-12 px-6 text-white text-center" style={{ backgroundColor: primaryColor }}>
                        <h3 className="text-xl font-bold mb-4 whitespace-pre-line">{content?.closing}</h3>
                        <button
                            className="px-8 py-3 bg-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                            style={{ color: primaryColor }}
                        >
                            지금 구매하기
                        </button>
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
