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
  updateSpeechStr: (value: number) => void;
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
  backGroundImage:
    'https://digital-person.oss-cn-hangzhou.aliyuncs.com/FileUpload/1/UID_1/Image/Background/nafiniaputraKwdp0pokIunsplash_1678881317677.jpg',
  updateBackGroundImage: (image: string) => set(() => ({ backGroundImage: image })),
  digitalManImage:
    'https://digital-person.oss-cn-hangzhou.aliyuncs.com/alpha/51c8b926-62b5-4a2e-944e-ea54499eb5e6_avatar.png',
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
});
const useStore = create<IStore>()(immer(devtools(store)));

export default useStore;
