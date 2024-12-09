export interface MenuItem {
  id: string;
  name: string;
  rate: number;
  category: 'beverages' | 'snacks' | 'meals' | 'others';
}

export const menuItems: MenuItem[] = [
  { id: 'tea', name: 'Tea', rate: 5, category: 'beverages' },
  { id: 'coffee', name: 'Coffee', rate: 15, category: 'beverages' },
  { id: 'nasta', name: 'Nasta', rate: 9, category: 'snacks' },
  { id: 'special', name: 'Special', rate: 12, category: 'snacks' },
  { id: 'lunch', name: 'Lunch', rate: 50, category: 'meals' },
  { id: 'dinner', name: 'Dinner', rate: 50, category: 'meals' },
  { id: 'roti', name: 'Roti', rate: 5, category: 'meals' },
  { id: 'water', name: 'Water', rate: 20, category: 'beverages' },
  { id: 'biscuit', name: 'Biscuit', rate: 10, category: 'snacks' },
  { id: 'colddrink', name: 'Cold Drink', rate: 20, category: 'beverages' }
];