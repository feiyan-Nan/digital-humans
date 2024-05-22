import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import useInputStore from './input';

interface IStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  setInputValue: (value: string) => void;
  /**
   * 位置信息
   */
  locations: any;
  updateLocations: (locations: any) => void;
  selected: boolean;
  updateSelected: (selected: boolean) => void;
}

const useStore = create<IStore>()(
  immer(
    devtools((set, get) => ({
      locations: { top: 0, left: 0, width: 180, height: 320 },
      updateLocations: (locations: any) => set((state) => ({ locations: { ...state.locations, ...locations } })),
      selected: false,
      updateSelected: (selected: any) =>
        set({
          selected,
        }),
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      setInputValue: useInputStore.getState().setInputValue,
    })),
  ),
);

export default useStore;
