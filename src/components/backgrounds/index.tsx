import React from 'react';
import { useSetState, useAsyncEffect } from 'ahooks';
import AutoTabs from '@/components/auto-tabs';
import UploadButton from '@/components/upload-button';
import CardList from '@/components/card-list';

type IProps = {
  list: { url: string; backgroundId: number }[];
  onTabChange?: (activeKey: number) => void;
  tabActiveKey?: number;
};

type IState = {
  items: string[];
  activeKey: number;
  list: { url: string; id: number }[];
};

const Backgrounds: React.FC<IProps> = ({ list, onTabChange, tabActiveKey = 0 }) => {
  const [state, setState] = useSetState<IState>({
    items: ['默认背景', '自定义'],

    activeKey: tabActiveKey,

    list: [],
  });

  useAsyncEffect(async () => {
    setState({
      list: list.map((i) => ({ ...i, id: i.backgroundId })),
    });
  }, [list]);

  const handleTabChange = (activeKey: number) => {
    if (activeKey !== state.activeKey) {
      setState({ activeKey });
      onTabChange && onTabChange(activeKey);
    }
  };

  return (
    <div className="sub_nav">
      <AutoTabs items={state.items} onTabChange={handleTabChange} />

      {state.activeKey === 0 ? (
        <CardList items={state.list} activeKey={2} />
      ) : (
        <>
          <div className="sub_nav_footer">
            <div className="sub_nav_tips">我们也支持上传自定义背景图</div>
            <UploadButton text="上传图片" accept="image/*" />
          </div>

          <AutoTabs items={['我的背景图']} />

          <CardList items={state.list} activeKey={0} />
        </>
      )}
    </div>
  );
};

export default Backgrounds;
