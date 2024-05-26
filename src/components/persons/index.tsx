import React, { useEffect } from 'react';
import { useSetState } from 'ahooks';
import AutoTabs from '@/components/auto-tabs';
import IButton from '@/components/button';
import CardList from '@/components/card-list';
import './index.scss';

import img from '@/static/imgs/test.png';

type Options = {
  items: string[];
  activeNum: number;
};

const Persons: React.FC = () => {
  const [state, setState] = useSetState<Options>({
    items: ['公用数字人', '定制数字人'],

    activeNum: 0,
  });

  const onTabChange = (num: number) => {
    if (num !== state.activeNum) {
      setState({ activeNum: num });
    }
  };

  const customization = () => {
    setState({ activeNum: 1 });
  };

  return (
    <div className="sub_nav">
      <AutoTabs items={state.items} activeNum={state.activeNum} key={state.activeNum} onChange={onTabChange} />

      {state.activeNum === 0 ? (
        <>
          <div className="persons_tip">
            没有合适的数字人？
            <span className="persons_btn" onClick={customization}>
              去定制
            </span>
          </div>

          <CardList
            items={[
              { img, text: 'text1' },
              { img, text: 'text1' },
              { img, text: 'text1' },
            ]}
            activeNum={2}
          />
        </>
      ) : (
        <>
          <div className="sub_nav_footer">
            <div className="sub_nav_tips">我们也支持上传上传音频驱动数字人，时长5分钟以内，格式支持MP3格式。</div>

            <IButton text="上传视频" />
          </div>

          {/* <AutoTabs items={['我的数字人']} travel key="travel" /> */}

          <CardList
            items={[
              { img, text: 'text1' },
              { img, text: 'text1' },
              { img, text: 'text1' },
            ]}
            activeNum={2}
          />
        </>
      )}
    </div>
  );
};

export default Persons;
