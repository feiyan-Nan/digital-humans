import React, { useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { MacScrollbar } from 'mac-scrollbar';
import { useSetState, useAsyncEffect } from 'ahooks';
import { Button, InputNumber, Space } from 'antd';
import AutoTabs from '@/components/auto-tabs';
import CardList from '@/components/card-list';
import TipAndUpload from '@/components/tipAndUpload';
import './index.scss';

import useStore from '@/store';

type IProps = {
  list: { url: string; id: number; templateId: number; enable: boolean; audioName: string }[];
  onTabChange?: (activeKey: number) => void;
  tabActiveKey?: number;
};

type IState = {
  activeKey: number;
  list: { url: string; id: number; templateId: number; enable: boolean; audioName: string }[];
  cardListActiveKey: number;
  speechStr: number;
};

const Voices: React.FC<IProps> = ({ onTabChange, list, tabActiveKey = 0 }) => {
  const { updateVoice, selectedVoice, speechStr, updateSpeedStr } = useStore(
    ({ updateVoice, selectedVoice, speechStr, updateSpeedStr }) => ({
      updateVoice,
      selectedVoice,
      speechStr,
      updateSpeedStr,
    }),
    shallow,
  );

  const [state, setState] = useSetState<IState>({
    activeKey: tabActiveKey,
    list,
    cardListActiveKey: -1,
    speechStr,
  });

  useAsyncEffect(async () => {
    setState({ list });
    console.log('AT-[ list oooooooooo   ppppppppppppppp &&&&&********** ]', list);
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

  const refInput = useRef<any>();

  const onPressEnter = () => {
    refInput.current.blur();
  };

  const onBlur = () => {
    updateSpeedStr(state.speechStr);
  };

  // useAsyncEffect(async () => {
  //   updateSpeedStr(state.speechStr);
  // }, [state.speechStr]);

  const onSpeedChange = (speechStr: any) => setState({ speechStr });

  return (
    <div className="voice">
      <div className="voice_header">
        <AutoTabs
          items={['主播音色', '定制音色']}
          onTabChange={handleTabChange}
          activeKey={state.activeKey}
          style={{ paddingRight: '8px' }}
        />

        <div className="persons_tip" style={{ paddingTop: '10px' }}>
          语速
          <Space.Compact style={{ width: '60%', marginLeft: '10px' }} size="small">
            <InputNumber
              defaultValue={state.speechStr}
              type="number"
              style={{ textAlign: 'center' }}
              min={1}
              max={10}
              step={0.1}
              onPressEnter={onPressEnter}
              onChange={onSpeedChange}
              onBlur={onBlur}
              ref={refInput}
            />

            <Button type="primary" style={{ background: '#7B68EE', fontSize: '10px' }} onClick={onPressEnter}>
              确认
            </Button>
          </Space.Compact>
        </div>

        {state.activeKey === 1 && (
          <>
            <TipAndUpload
              tip="我们支持您上传一分钟音频定制克隆您的专属音色，格式支持MP3格式。"
              btnText="上传声音"
              accept="image/*"
              style={{ fontSize: '12px', lineHeight: '20px' }}
              alert="添加产品微信定制：feastfu"
            />

            <AutoTabs items={['我的音色']} />
          </>
        )}
      </div>
      <MacScrollbar>
        <CardList items={state.list} onChange={onChange} activeKey={state.cardListActiveKey} type="avatar" />
      </MacScrollbar>
    </div>
  );
};

export default Voices;
