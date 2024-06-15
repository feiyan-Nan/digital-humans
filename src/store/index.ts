import { create, StateCreator } from 'zustand';
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
  updateDigitalImage: (image: string) => void;
  /**
   * 横竖屏 VERTICAL：竖版 HORIZONTAL: 横版
   */
  align: 'VERTICAL' | 'HORIZONTAL';
  updateAlign: (align: 'VERTICAL' | 'HORIZONTAL') => void;
  /**
   * 缩放比例
   */
  scale: number;
  updateScale: (scale: number) => void;
  /**
   * 背景图片地址
   */
  backGroundImage: string;
  updateBackGroundImage: (image: string) => void;

  textContent: string;
  updateTextContent: (image: string) => void;

  selectedPerson: any;
  updatePerson: (value: any) => void;

  selectedBackground: any;
  updateBackground: (value: any) => void;

  selectedVoice: any;
  updateVoice: (value: any) => void;

  currentName: string;
  updateCurrentName: (value: string) => void;

  speechStr: number;
  updateSpeedStr: (value: number) => void;

  draftData: any;
  updateDraftData: (value: number) => void;
}

type CustomStoreType = StateCreator<IStore>;

const store: CustomStoreType = (set, get) => ({
  locations: { top: 50, left: 323, width: 324, height: 575 },
  updateLocations: (locations: any) => set((state) => ({ locations: { ...state.locations, ...locations } })),
  selected: true,
  updateSelected: (selected: any) =>
    set({
      selected,
    }),
  speechStr: 1.2,
  updateSpeechStr: (value: number) => set(() => ({ speechStr: value })),
  textContent: '',
  updateTextContent: (val: string) => set(() => ({ textContent: val })),
  backGroundImage: '',
  updateBackGroundImage: (image: string) => set(() => ({ backGroundImage: image })),
  digitalManImage: '',
  updateDigitalImage: (image: string) => set(() => ({ digitalManImage: image })),
  align: 'VERTICAL',
  updateAlign: (align: 'VERTICAL' | 'HORIZONTAL') => set(() => ({ align })),
  scale: 1,
  updateScale: (scale: number) => set(() => ({ scale })),
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setInputValue: useInputStore.getState().setInputValue,

  selectedPerson: null,
  updatePerson: (selectedPerson: any) => set(() => ({ selectedPerson })),
  selectedBackground: null,
  updateBackground: (selectedBackground: any) => set(() => ({ selectedBackground })),
  selectedVoice: null,
  updateVoice: (selectedVoice: any) => set(() => ({ selectedVoice })),

  currentName: '',
  updateCurrentName: (currentName: string) => set(() => ({ currentName })),

  updateSpeedStr: (speechStr: number) => set(() => ({ speechStr })),

  draftData: null,
  updateDraftData: (draftData: any) => set(() => ({ draftData })),
});

const useStore = create<IStore>()(immer(devtools(store)));

export default useStore;
