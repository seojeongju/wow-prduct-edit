"use client";

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';
import { Download, Copy, CheckCircle2, FileImage, FileCode, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExportPanel() {
    const { setStep } = useStore();
    const [isExporting, setIsExporting] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleDownloadImage = async () => {
        const node = document.getElementById('preview-capture-area');
        if (!node) {
            alert("프리뷰 영역을 찾을 수 없습니다.");
            return;
        }

        setIsExporting(true);
        try {
            // High quality scale
            const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `smart-detail-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Failed to capture:', error);
            alert("이미지 저장에 실패했습니다.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleCopyHtml = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        // Actual HTML copy logic would go here (requires converting React tree to HTML string or copying innerHTML)
    };

    return (
        <div className="p-6 pb-32 space-y-8 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">Step 4</span>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">완성 및 내보내기</h2>
                </div>
                <p className="text-sm text-slate-500">
                    멋진 상세페이지가 완성되었습니다! 원하는 방식으로 저장하세요.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">

                {/* Option 1: Image Download */}
                <div className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 transition-all shadow-sm group">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                            <FileImage className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900">통이미지로 저장</h3>
                            <p className="text-xs text-slate-500 mt-1 mb-3">
                                전체 내용을 고화질 PNG 파일 1장으로 저장합니다.<br />
                                (스마트스토어, 블로그, SNS 등에 최적화)
                            </p>
                            <Button
                                onClick={handleDownloadImage}
                                disabled={isExporting}
                                className="w-full bg-slate-900 hover:bg-slate-800"
                            >
                                {isExporting ? "변환 중..." : "이미지 다운로드"}
                                {!isExporting && <Download className="w-4 h-4 ml-2" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Option 2: HTML Copy */}
                <div className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 transition-all shadow-sm group opacity-60">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                            <FileCode className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900">HTML 코드로 복사</h3>
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Premium Only</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 mb-3">
                                텍스트 검색이 가능한 HTML 원본 소스를 복사합니다.<br />
                                (이미지 호스팅 필요)
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleCopyHtml}
                                disabled={true} // Disabled for Free version
                            >
                                {copied ? "복사 완료!" : "HTML 복사"}
                                {copied ? <Check className="w-4 h-4 ml-2" /> : <Copy className="w-4 h-4 ml-2" />}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 w-full lg:w-[inherit] p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 z-20 flex gap-3">
                <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(3)}>
                    수정하기
                </Button>
                <Button
                    className="flex-[2] h-12 bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-500/20"
                    onClick={() => alert("프로젝트가 저장되었습니다! (데모)")}
                >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    프로젝트 완료
                </Button>
            </div>

        </div>
    );
}
