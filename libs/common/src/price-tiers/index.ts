export const priceTiers = ['starter', 'growth', 'scale', 'enterprise'] as const;
export type PriceTier = typeof priceTiers[number];

interface PriceTierFeatures {
  recommended?: boolean;
  price: number;
  active: string[];
  inactive?: string[];
}

export const priceTierFeatures: Record<PriceTier, PriceTierFeatures> = {
  starter: {
    price: 9,
    active: ['Feature 1', 'Feature 2'],
    inactive: ['Feature 3', 'Feature 4', 'Feature 5', 'Feature 6'],
  },
  growth: {
    price: 29,
    active: ['Feature 1', 'Feature 2', 'Feature 3'],
    inactive: ['Feature 4', 'Feature 5', 'Feature 6'],
  },
  scale: {
    price: 49,
    recommended: true,
    active: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
    inactive: ['Feature 5', 'Feature 6'],
  },
  enterprise: {
    price: 199,
    active: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5', 'Feature 6'],
  },
};
