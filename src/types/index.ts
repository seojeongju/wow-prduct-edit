export interface ProductData {
    productName: string;
    benefits: string[];
    targetAudience: string;
    tone: 'professional' | 'emotional' | 'witty';
    imageUrl: string | null;
    generatedContent?: {
        hook?: string;
        features?: string;
        trust?: string;
        closing?: string;
    };
    layoutOrder?: string[];
    canvasSize?: {
        width: number;
        height?: number; // Optional (Auto if undefined)
        mode: 'scroll' | 'fixed';
    };
    styleConfig?: {
        font: 'pretendard' | 'chosun' | 'gmarket';
        primaryColor: string; // Brand/Button Colors
        backgroundColor: string; // Section Background Colors
    };
}
