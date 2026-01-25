"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Image as ImageIcon, Type, LayoutTemplate, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// --- Sortable Item Component ---
interface SortableItemProps {
    id: string;
    type: 'text' | 'image' | 'features';
    title: string;
    content: string;
    isActive?: boolean;
}

function SortableItem({ id, type, title, content, isActive }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm hover:border-indigo-400 hover:shadow-md transition-all group",
                isActive ? "border-indigo-500 ring-1 ring-indigo-500" : "border-slate-200"
            )}
        >
            <div {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-indigo-600">
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-none text-slate-500">
                {type === 'image' ? <ImageIcon className="w-5 h-5" /> :
                    type === 'features' ? <LayoutTemplate className="w-5 h-5" /> : <Type className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 mb-0.5">{title}</h4>
                <p className="text-xs text-slate-500 truncate">{content.substring(0, 50)}...</p>
            </div>
        </div>
    );
}

// --- Main Editor Component ---
export default function LayoutEditor() {
    const { productData, currentStep, setStep, updateProductData } = useStore();

    // Define available block definitions
    const blockDefinitions = {
        hook: { type: 'text', title: '📢 도입부 (Hook)' },
        image: { type: 'image', title: '🖼️ 대표 이미지' },
        features: { type: 'features', title: '✨ 핵심 특징' },
        trust: { type: 'text', title: '🤝 신뢰/리뷰' },
        closing: { type: 'text', title: '🔥 클로징' },
    };

    // Initialize items based on global layoutOrder
    const [items, setItems] = useState(() => {
        const order = productData.layoutOrder || ['hook', 'image', 'features', 'trust', 'closing'];
        return order.map(id => {
            const def = blockDefinitions[id as keyof typeof blockDefinitions];
            let content = '';
            if (id === 'image') content = productData.imageUrl || '이미지 없음';
            else content = productData.generatedContent?.[id as keyof typeof productData.generatedContent] || '';

            return { id, ...def, content };
        });
    });

    // Update local items when productData changes (e.g. image update)
    useEffect(() => {
        setItems(prev => prev.map(item => {
            let content = '';
            if (item.id === 'image') content = productData.imageUrl || '이미지 없음';
            else content = productData.generatedContent?.[item.id as keyof typeof productData.generatedContent] || '';
            return { ...item, content };
        }));
    }, [productData]);

    const [theme, setTheme] = useState<'modern' | 'luxury' | 'pop'>('modern');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Sync with Global Store
                const newOrder = newItems.map(i => i.id);
                updateProductData({ layoutOrder: newOrder });

                return newItems;
            });
        }
    }

    // TODO: 실제로는 items 순서와 theme 정보를 store에 저장해서 미리보기에 반영해야 함.
    // 현재는 UI 데모 구현

    return (
        <div className="p-6 pb-32 space-y-8 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">디자인 편집</h2>
                <p className="text-sm text-slate-500">
                    블록을 드래그하여 순서를 바꾸고, 전체적인 분위기를 결정하세요.
                </p>
            </div>

            {/* Style Details */}
            <div className="space-y-4">
                <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" /> 스타일 설정
                </Label>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-5 shadow-sm">

                    {/* 1. Theme Presets (Quick Apply) */}
                    <div className="space-y-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quick Preset</span>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'modern', name: '모던', color: '#4f46e5', bg: '#ffffff', font: 'pretendard' },
                                { id: 'luxury', name: '럭셔리', color: '#1a1a1a', bg: '#f8f8f8', font: 'chosun' },
                                { id: 'pop', name: '팝', color: '#f59e0b', bg: '#fffbeb', font: 'gmarket' },
                            ].map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => updateProductData({
                                        styleConfig: {
                                            font: t.font as any,
                                            primaryColor: t.color,
                                            backgroundColor: t.bg
                                        }
                                    })}
                                    className="px-3 py-2 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700"
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-slate-100" />

                    {/* 2. Detailed Controls */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Font Family</span>
                            <div className="flex flex-col gap-1.5">
                                {[
                                    { id: 'pretendard', name: '프리텐다드 (고딕)' },
                                    { id: 'chosun', name: '조선일보 (명조)' },
                                    { id: 'gmarket', name: 'G마켓 (타이틀)' },
                                ].map(f => (
                                    <label key={f.id} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="font"
                                            checked={productData.styleConfig?.font === f.id}
                                            onChange={() => updateProductData({ styleConfig: { ...productData.styleConfig!, font: f.id as any } })}
                                            className="accent-indigo-600"
                                        />
                                        <span className="text-xs text-slate-600 group-hover:text-indigo-600 transition-colors">{f.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Primary Color</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden relative">
                                        <input
                                            type="color"
                                            value={productData.styleConfig?.primaryColor || '#4f46e5'}
                                            onChange={(e) => updateProductData({ styleConfig: { ...productData.styleConfig!, primaryColor: e.target.value } })}
                                            className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 p-0 border-0 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">{productData.styleConfig?.primaryColor}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Content Bg</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden relative">
                                        <input
                                            type="color"
                                            value={productData.styleConfig?.backgroundColor || '#ffffff'}
                                            onChange={(e) => updateProductData({ styleConfig: { ...productData.styleConfig!, backgroundColor: e.target.value } })}
                                            className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 p-0 border-0 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">{productData.styleConfig?.backgroundColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {/* Canvas Size Settings (New) */}
            <div className="space-y-3">
                <Label className="flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4" /> 캔버스 사이즈
                </Label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    {/* Presets */}
                    <div className="flex gap-2">
                        {[
                            { label: '스마트스토어 (860px)', w: 860, h: undefined },
                            { label: '인스타그램 (1080px)', w: 1080, h: 1080 },
                            { label: 'FHD (1920px)', w: 1920, h: undefined },
                        ].map((preset, idx) => (
                            <button
                                key={idx}
                                onClick={() => updateProductData({
                                    canvasSize: {
                                        width: preset.w,
                                        height: preset.h,
                                        mode: preset.h ? 'fixed' : 'scroll'
                                    }
                                })}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
                                    productData.canvasSize?.width === preset.w
                                        ? "bg-white border-indigo-500 text-indigo-600 shadow-sm"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                                )}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    {/* Manual Input */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Width (px)</span>
                            <input
                                type="number"
                                value={productData.canvasSize?.width || 860}
                                onChange={(e) => updateProductData({
                                    canvasSize: {
                                        ...productData.canvasSize,
                                        width: Number(e.target.value),
                                        mode: 'scroll' // Manual input usually implies detailed page
                                    } as any
                                })}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center pt-5 text-slate-400">×</div>
                        <div className="flex-1 space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Height</span>
                            <input
                                type="text"
                                value={productData.canvasSize?.height || 'Auto'}
                                disabled
                                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-400 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Draggable List */}
            <div className="space-y-3">
                <Label className="flex items-center gap-2 mb-2">
                    <LayoutTemplate className="w-4 h-4" /> 레이아웃 구성
                </Label>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {items.map((item) => (
                                <SortableItem
                                    key={item.id}
                                    id={item.id}
                                    type={item.type as any}
                                    title={item.title}
                                    content={item.content}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 w-full lg:w-[inherit] p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 z-20 flex gap-3">
                <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(2)}>
                    이전
                </Button>
                <Button
                    className="flex-[2] h-12 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/20"
                    onClick={() => setStep(4)} // Next to Final Step
                >
                    디자인 확정 (저장)
                </Button>
            </div>

        </div>
    );
}
