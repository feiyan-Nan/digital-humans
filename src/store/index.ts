import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import useInputStore from './input';

interface IStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  setInputValue: (value: string) => void;
}

const useStore = create<IStore>()(
  devtools((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    setInputValue: useInputStore.getState().setInputValue,
  })),
);

export default useStore;
