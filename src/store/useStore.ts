import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProductData } from '@/types';

interface AppState {
    currentStep: number;
    isLoading: boolean;
    productData: ProductData;
    setStep: (step: number) => void;
    prevStep: () => void;
    updateProductData: (data: Partial<ProductData>) => void;
    setLoading: (loading: boolean) => void;
    generateCopy: () => Promise<void>;
    generateImage: (prompt: string) => Promise<void>;
    resetProject: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            currentStep: 1, // 1: Planning, 2: Image, 3: Design, 4: Export
            isLoading: false,

            productData: {
                productName: '',
                benefits: [],
                targetAudience: '',
                tone: 'professional',
                imageUrl: null,
                layoutOrder: ['hook', 'image', 'features', 'trust', 'closing'],
                canvasSize: { width: 860, mode: 'scroll' }, // Default SmartStore size
                styleConfig: {
                    font: 'pretendard',
                    primaryColor: '#4f46e5', // Check Indigo-600
                    backgroundColor: '#ffffff'
                }
            },

            setStep: (step) => set({ currentStep: step }),

            prevStep: () => set((state) => ({
                currentStep: Math.max(1, state.currentStep - 1)
            })),

            updateProductData: (data) => set((state) => ({
                productData: { ...state.productData, ...data }
            })),

            setLoading: (loading) => set({ isLoading: loading }),

            generateCopy: async () => {
                const { productData } = get();

                if (!productData.productName) {
                    alert("상품명을 입력해주세요.");
                    return;
                }

                set({ isLoading: true });

                try {
                    const response = await fetch('/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(productData),
                    });

                    if (!response.ok) throw new Error("Generation Failed");

                    const generatedContent = await response.json();

                    set((state) => ({
                        productData: { ...state.productData, generatedContent },
                        isLoading: false,
                        // currentStep stays at 1
                    }));

                } catch (error) {
                    console.error(error);
                    alert("생성 실패");
                    set({ isLoading: false });
                }
            },

            generateImage: async (prompt: string) => {
                set({ isLoading: true });
                try {
                    const response = await fetch('/api/generate-image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt, type: 'generation' }),
                    });

                    if (!response.ok) throw new Error("Image Generation Failed");

                    const data = await response.json();
                    const generatedUrl = data.url;

                    // Update product image with generated one
                    set((state) => ({
                        productData: { ...state.productData, imageUrl: generatedUrl },
                        isLoading: false
                    }));

                } catch (error) {
                    console.error(error);
                    alert("이미지 생성 실패");
                    set({ isLoading: false });
                }
            },

            resetProject: () => set({
                currentStep: 1,
                productData: {
                    productName: '',
                    benefits: [],
                    targetAudience: '',
                    tone: 'professional',
                    imageUrl: null,
                    layoutOrder: ['hook', 'image', 'features', 'trust', 'closing'],
                    canvasSize: { width: 860, mode: 'scroll' },
                    styleConfig: { font: 'pretendard', primaryColor: '#4f46e5', backgroundColor: '#ffffff' }
                }
            })
        }),
        {
            name: 'smart-detail-storage', // unique name
            storage: createJSONStorage(() => localStorage),
            skipHydration: true, // Fix for Next.js SSR hydration mismatch
            version: 1,
        }
    )
);
