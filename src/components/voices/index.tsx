import React from 'react';
import { useSetState } from 'ahooks';
import { Button, Input, Select, Space } from 'antd';
import AutoTabs from '@/components/auto-tabs';
import IButton from '@/components/button';
import CardList from '@/components/card-list';
// import './index.scss';

import img from '@/static/imgs/test.png';

type Options = {
  items: string[];
  activeNum: number;
};

const Voices: React.FC = () => {
  const [state, setState] = useSetState<Options>({
    items: ['主播音色', '定制音色'],

    activeNum: 0,
  });

  const onTabChange = (num: number) => {
    if (num !== state.activeNum) {
      setState({ activeNum: num });
    }
  };

  return (
    <div className="sub_nav">
      <AutoTabs items={state.items} onChange={onTabChange} mode="light" />

      {state.activeNum === 0 ? (
        <>
          <div className="persons_tip" style={{ paddingTop: '10px', marginBottom: '10px' }}>
            语速
            <Space.Compact style={{ width: '60%', marginLeft: '10px' }} size="small">
              <Input defaultValue={1.2} type="number" style={{ textAlign: 'center' }} />
              <Button type="primary">确认</Button>
            </Space.Compact>
          </div>

          <CardList items={[{ img }, { img }, { img }]} activeNum={2} />
        </>
      ) : (
        <>
          <div className="sub_nav_footer">
            <div className="sub_nav_tips">我们也支持上传上传音频驱动数字人，时长5分钟以内，格式支持MP3格式。</div>

            <IButton text="上传图片" />
          </div>

          <AutoTabs items={['我的音色']} travel />

          <CardList items={[{ img }, { img }, { img }]} activeNum={0} />
        </>
      )}
    </div>
  );
};

export default Voices;
