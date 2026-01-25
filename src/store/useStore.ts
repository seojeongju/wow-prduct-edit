import { create } from 'zustand';
import { ProductData } from '@/types';

interface AppState {
    currentStep: number;
    productData: ProductData;
    isLoading: boolean;

    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateProductData: (data: Partial<ProductData>) => void;
    setLoading: (loading: boolean) => void;
    generateCopy: () => Promise<void>;
    generateImage: (prompt: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    currentStep: 1, // 1: Planning, 2: Image, 3: Design, 4: Export
    isLoading: false,

    productData: {
        productName: '',
        benefits: ['', '', ''],
        targetAudience: '',
        tone: 'professional',
        imageUrl: null,
    },

    setStep: (step) => set({ currentStep: step }),
    nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
    prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

    updateProductData: (newData) => set((state) => ({
        productData: { ...state.productData, ...newData }
    })),

    setLoading: (loading) => set({ isLoading: loading }),

    generateCopy: async () => {
        const { productData, currentStep } = get();

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
                // currentStep stay at 1 to allow editing
            }));

        } catch (error) {
            console.error(error);
            alert("상세페이지 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
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
            alert("이미지 생성에 실패했습니다.");
            set({ isLoading: false });
        }
    }
}));
