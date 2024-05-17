import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface IStore {
  inputValue: string;
  setInputValue: (value: string) => void;
}

const useInputStore = create<IStore>()(
  immer(
    devtools((set) => ({
      inputValue: '',
      setInputValue: (value: string) => {
        set((state) => {
          state.inputValue = value;
        });
      },
    })),
  ),
);

export default useInputStore;
