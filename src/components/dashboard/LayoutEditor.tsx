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
    const { productData, currentStep, setStep } = useStore();
    const [items, setItems] = useState([
        { id: 'hook', type: 'text', title: '📢 도입부 (Hook)', content: productData.generatedContent?.hook || '' },
        { id: 'image', type: 'image', title: '🖼️ 대표 이미지', content: productData.imageUrl || '이미지 없음' },
        { id: 'features', type: 'features', title: '✨ 핵심 특징', content: productData.generatedContent?.features || '' },
        { id: 'trust', type: 'text', title: '🤝 신뢰/리뷰', content: productData.generatedContent?.trust || '' },
        { id: 'closing', type: 'text', title: '🔥 클로징', content: productData.generatedContent?.closing || '' },
    ]);

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
                return arrayMove(items, oldIndex, newIndex);
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

            {/* Theme Selector */}
            <div className="space-y-3">
                <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" /> 테마 선택
                </Label>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'modern', name: '모던 (Modern)', color: 'bg-indigo-500' },
                        { id: 'luxury', name: '럭셔리 (Luxury)', color: 'bg-slate-900' },
                        { id: 'pop', name: '팝 (Pop)', color: 'bg-amber-500' },
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all",
                                theme === t.id ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-500/20" : "border-slate-200 bg-white hover:border-slate-300"
                            )}
                        >
                            <div className={`w-3 h-3 rounded-full ${t.color}`} />
                            <span className="text-xs font-bold text-slate-700">{t.name}</span>
                        </button>
                    ))}
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
