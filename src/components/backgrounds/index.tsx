import React from 'react';
import { useSetState } from 'ahooks';
import AutoTabs from '@/components/auto-tabs';
import IButton from '@/components/button';
import CardList from '@/components/card-list';
// import './index.scss';

import img from '@/static/imgs/test.png';

type Options = {
  items: string[];
  activeNum: number;
};

const Backgrounds: React.FC = () => {
  const [state, setState] = useSetState<Options>({
    items: ['默认背景', '自定义'],

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
          {/* <div className="persons_tip">
            没有合适的数字人？<span className="persons_btn">去定制</span>
          </div> */}

          <CardList items={[{ img }, { img }, { img }]} activeNum={2} />
        </>
      ) : (
        <>
          <div className="sub_nav_footer">
            <div className="sub_nav_tips">我们也支持上传自定义背景图</div>

            <IButton text="上传图片" />
          </div>

          <AutoTabs items={['我的背景图']} travel />

          <CardList items={[{ img }, { img }, { img }]} activeNum={0} />
        </>
      )}
    </div>
  );
};

export default Backgrounds;
