import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../utils/storage';

export interface CalculatorItem {
  id: string;
  description: string;
  amount: string;
}

interface CalculatorState {
  items: CalculatorItem[];
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, data: Partial<CalculatorItem>) => void;
  clearAll: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      items: [],
      addItem: () => set((state) => ({
        items: [...state.items, { id: generateId(), description: `Item ${state.items.length + 1}`, amount: '' }]
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      updateItem: (id, data) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, ...data } : item)
      })),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'calculator-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
