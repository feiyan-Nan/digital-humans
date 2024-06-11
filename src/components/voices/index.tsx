import React from 'react';
import { useSetState, useAsyncEffect } from 'ahooks';
import { Button, InputNumber, Space } from 'antd';
import AutoTabs from '@/components/auto-tabs';
import UploadButton from '@/components/upload-button';
import CardList from '@/components/card-list';

type IProps = {
  list: { url: string; id: number }[];
  onTabChange?: (activeKey: number) => void;
  tabActiveKey?: number;
};

type IState = {
  activeKey: number;
  list: { url: string; id: number }[];
};

const Voices: React.FC<IProps> = ({ onTabChange, list, tabActiveKey = 0 }) => {
  const [state, setState] = useSetState<IState>({
    activeKey: tabActiveKey,
    list,
  });

  useAsyncEffect(async () => {
    console.log('AT-[ useAsyncEffect list &&&&&********** ]', list);
    setState({ list });
  }, [list]);

  const handleTabChange = (activeKey: number) => {
    if (activeKey !== state.activeKey) {
      setState({ activeKey });

      onTabChange && onTabChange(activeKey);
    }
  };

  return (
    <div className="sub_nav">
      <AutoTabs items={['主播音色', '定制音色']} onTabChange={handleTabChange} activeKey={state.activeKey} />

      {state.activeKey === 0 ? (
        <>
          <div className="persons_tip" style={{ paddingTop: '10px', marginBottom: '10px' }}>
            语速
            <Space.Compact style={{ width: '60%', marginLeft: '10px' }} size="small">
              <InputNumber defaultValue={1.2} type="number" style={{ textAlign: 'center' }} />
              <Button type="primary">确认</Button>
            </Space.Compact>
          </div>

          <CardList items={state.list} activeKey={0} key={Math.random()} />
        </>
      ) : (
        <>
          <div className="sub_nav_footer">
            <div className="sub_nav_tips">我们也支持上传上传音频驱动数字人，时长5分钟以内，格式支持MP3格式。</div>
            <UploadButton text="上传声音" accept="image/*" />
          </div>

          <AutoTabs items={['我的音色']} />

          <CardList items={state.list} activeKey={0} key={Math.random()} />
        </>
      )}
    </div>
  );
};

export default Voices;
