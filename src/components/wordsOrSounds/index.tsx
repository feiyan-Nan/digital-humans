import React from 'react';
import { useAsyncEffect, useSetState } from 'ahooks';
import { Input } from 'antd';
import AutoTabs from '@/components/auto-tabs';
import TipAndUpload from '@/components/tipAndUpload';
import useStore from "@/store";
import {shallow} from "zustand/shallow";

const { TextArea } = Input;

type IProps = {
  tabActiveKey?: number;
  onTabChange?: (activeKey: number) => void;
};

type IState = {
  tabActiveKey: number;
};

const WordsOrSounds: React.FC<IProps> = ({ tabActiveKey = 0, onTabChange }) => {
  const [state, setState] = useSetState<IState>({
    tabActiveKey,
  });
  const {updateTextContent, textContent, updatePerson, selectedBackground, updateBackground, selectedVoice, updateVoice} = useStore(
    ({updateTextContent,textContent, updatePerson, selectedBackground, updateBackground, selectedVoice, updateVoice}) => ({
      updateTextContent,
      textContent,
      updatePerson,

      selectedBackground,
      updateBackground,

      selectedVoice,
      updateVoice,
    }),
    shallow,
  );

  useAsyncEffect(async () => {
    setState({ tabActiveKey });
  }, [tabActiveKey]);

  // const handleOnTabChange = (tabActiveKey: number) => {
  //   setState({ tabActiveKey });
  // };
  const onChange = (value) => {
    updateTextContent(value.target.value)
  }

  return (
    <div className="wordsorsounds">
      <AutoTabs
        items={['文字播报', '音频播报']}
        activeKey={state.tabActiveKey}
        textMode="black"
        onTabChange={onTabChange}
      />

      {state.tabActiveKey === 0 ? (
        <TextArea
          showCount
          maxLength={5000}
          placeholder="请输入文字"
          style={{ height: 200, resize: 'none', marginTop: '20px', padding: 0, border: 'none' }}
          value={textContent}
          onChange={onChange}
        />
      ) : (
        <TipAndUpload
          tip="我们也支持上传上传音频驱动数字人，时长5分钟以内，格式支持MP3格式。"
          btnText="上传音频"
          accept="audio/*"
          black
          style={{
            marginTop: '20px',
            marginBottom: '80px',
            fontSize: '12px',
            lineHeight: '20px',
          }}
        />
      )}
    </div>
  );
};

export default WordsOrSounds;
