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
  /**
   * 选中状态
   */
  selected: any;
  updateSelected: (selected: boolean) => void;
  /**
   * 数字人的图片地址
   */
  digitalManImage: string;
}

const useStore = create<IStore>()(
  immer(
    devtools((set, get) => ({
      locations: { top: 50, left: 323, width: 324, height: 575 },
      updateLocations: (locations: any) => set((state) => ({ locations: { ...state.locations, ...locations } })),
      selected: true,
      updateSelected: (selected: any) =>
        set({
          selected,
        }),
      digitalManImage:
        'https://digital-person.oss-cn-hangzhou.aliyuncs.com/alpha/51c8b926-62b5-4a2e-944e-ea54499eb5e6_avatar.png',
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      setInputValue: useInputStore.getState().setInputValue,
    })),
  ),
);

export default useStore;
