import React from 'react';
import { shallow } from 'zustand/shallow';
import { useSetState, useAsyncEffect } from 'ahooks';
import { Button, InputNumber, Space } from 'antd';
import AutoTabs from '@/components/auto-tabs';
import CardList from '@/components/card-list';
import TipAndUpload from '@/components/tipAndUpload';
import './index.scss';

import useStore from '@/store';

type IProps = {
  list: { url: string; id: number; templateId: number }[];
  onTabChange?: (activeKey: number) => void;
  tabActiveKey?: number;
};

type IState = {
  activeKey: number;
  list: { url: string; id: number; templateId: number }[];
  cardListActiveKey: number;
};

const Voices: React.FC<IProps> = ({ onTabChange, list, tabActiveKey = 0 }) => {
  const { updateVoice, selectedVoice } = useStore(
    ({ updateVoice, selectedVoice }) => ({ updateVoice, selectedVoice }),
    shallow,
  );

  const [state, setState] = useSetState<IState>({
    activeKey: tabActiveKey,
    list,
    cardListActiveKey: -1,
  });

  useAsyncEffect(async () => {
    setState({ list });
  }, [list]);

  useAsyncEffect(async () => {
    const cardListActiveKey = state.list.findIndex((i) => i.templateId === selectedVoice.templateId);
    setState({ cardListActiveKey });
  }, [state.list, selectedVoice]);

  const handleTabChange = (activeKey: number) => {
    if (activeKey !== state.activeKey) {
      setState({ activeKey });

      onTabChange && onTabChange(activeKey);
    }
  };

  const onChange = (data: any) => updateVoice(data);

  return (
    <div className="voice">
      <div className="voice_header">
        <AutoTabs items={['主播音色', '定制音色']} onTabChange={handleTabChange} activeKey={state.activeKey} />

        <div className="persons_tip" style={{ paddingTop: '10px' }}>
          语速
          <Space.Compact style={{ width: '60%', marginLeft: '10px' }} size="small">
            <InputNumber defaultValue={1.2} type="number" style={{ textAlign: 'center' }} />
            <Button type="primary">确认</Button>
          </Space.Compact>
        </div>

        {state.activeKey === 1 && (
          <>
            <TipAndUpload
              tip="我们也支持上传上传音频驱动数字人，时长5分钟以内，格式支持MP3格式。"
              btnText="上传声音"
              accept="image/*"
            />

            <AutoTabs items={['我的音色']} />
          </>
        )}
      </div>

      <div className="voice_main">
        <CardList items={state.list} onChange={onChange} activeKey={state.cardListActiveKey} />
      </div>
    </div>
  );
};

export default Voices;
