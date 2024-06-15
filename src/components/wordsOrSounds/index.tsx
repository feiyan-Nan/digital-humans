import React, { useRef } from 'react';
import { useAsyncEffect, useSetState } from 'ahooks';
import { Input, InputRef } from 'antd';
import { shallow } from 'zustand/shallow';
import AutoTabs from '@/components/auto-tabs';
import TipAndUpload from '@/components/tipAndUpload';
import useStore from '@/store';

const { TextArea } = Input;

type IProps = {
  tabActiveKey?: number;
  onTabChange?: (activeKey: number) => void;
  onTextChange?: (text: string) => void;
  onFileChange?: (formData: FormData, file: File) => void;
  focus?: boolean;
  tip?: string;
};

type IState = {
  tabActiveKey: number;
};

const WordsOrSounds: React.FC<IProps> = ({
  tabActiveKey = 0,
  onTabChange,
  onTextChange,
  focus,
  onFileChange,
  tip = '我们也支持上传上传音频驱动数字人，时长5分钟以内，格式支持MP3格式。',
}) => {
  const [state, setState] = useSetState<IState>({ tabActiveKey });

  const { updateTextContent, textContent } = useStore(
    ({ updateTextContent, textContent }) => ({ updateTextContent, textContent }),
    shallow,
  );

  const inputRef = useRef<InputRef>(null);

  useAsyncEffect(async () => {
    focus && inputRef.current?.focus();
  }, [focus]);

  useAsyncEffect(async () => {
    setState({ tabActiveKey });
  }, [tabActiveKey]);

  const onChange = (value: any) => updateTextContent(value.target.value);

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
          maxLength={1000}
          placeholder="请输入文字"
          style={{ height: 200, resize: 'none', marginTop: '20px', padding: 0, border: 'none' }}
          value={textContent}
          onChange={onChange}
          ref={inputRef}
        />
      ) : (
        <TipAndUpload
          tip={tip}
          btnText="上传音频"
          accept="audio/mp3"
          black
          style={{
            marginTop: '20px',
            marginBottom: '80px',
            fontSize: '12px',
            lineHeight: '20px',
          }}
          onChange={onFileChange}
        />
      )}
    </div>
  );
};

export default WordsOrSounds;
