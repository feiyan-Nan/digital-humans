import React from 'react';
import { useSetState, useAsyncEffect } from 'ahooks';
import AutoTabs from '@/components/auto-tabs';
import IButton from '@/components/button';
import CardList from '@/components/card-list';
// import './index.scss';

// import img from '@/static/imgs/test.png';

type IState = {
  items: string[];
  activeNum: number;
  list: { url: string; id: number }[];
};

type IProps = {
  list: { url: string; backgroundId: number }[];
};

const Backgrounds: React.FC<IProps> = ({ list }) => {
  const [state, setState] = useSetState<IState>({
    items: ['默认背景', '自定义'],

    activeNum: 0,

    list: [],
  });

  useAsyncEffect(async () => {
    setState({
      list: list.map((i) => ({ ...i, id: i.backgroundId })),
    });
  }, [list]);

  const onTabChange = (num: number) => {
    if (num !== state.activeNum) {
      setState({ activeNum: num });
    }
  };

  return (
    <div className="sub_nav">
      <AutoTabs items={state.items} onChange={onTabChange} mode="light" />

      {state.activeNum === 0 ? (
        <CardList items={state.list} activeNum={2} />
      ) : (
        <>
          <div className="sub_nav_footer">
            <div className="sub_nav_tips">我们也支持上传自定义背景图</div>

            <IButton text="上传图片" />
          </div>

          <AutoTabs items={['我的背景图']} travel />

          <CardList items={state.list} activeNum={0} />
        </>
      )}
    </div>
  );
};

export default Backgrounds;
