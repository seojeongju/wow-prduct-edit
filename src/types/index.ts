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
    layoutOrder?: string[]; // e.g. ['hook', 'image', 'features', ...]
}
