import React from 'react';
import { useSetState, useAsyncEffect } from 'ahooks';
import AutoTabs from '@/components/auto-tabs';
import CardList from '@/components/card-list';
import TipAndUpload from '@/components/tipAndUpload';
import './index.scss';

import api from '@/api';

type IProps = {
  list: { url: string; backgroundId: number }[];
  onTabChange?: (activeKey: number) => void;
  tabActiveKey?: number;
  whenUploadSuccess: () => void;
};

type IState = {
  items: string[];
  activeKey: number;
  list: { url: string; id: number }[];
};

const Backgrounds: React.FC<IProps> = ({ list, onTabChange, tabActiveKey = 0, whenUploadSuccess }) => {
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

  const onFileChange = async (formData: FormData, file: File) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();

      img.onload = function () {
        const { width, height } = img;

        console.log('AT-[ width, height &&&&&********** ]', width, height);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);

    await api.uploadBackgroundFile(formData);
    whenUploadSuccess();
  };

  return (
    <div className="backgrounds">
      <div className="backgrounds_header">
        <AutoTabs items={state.items} onTabChange={handleTabChange} />

        {state.activeKey === 1 && (
          <TipAndUpload tip="我们也支持上传自定义背景图" btnText="上传图片" accept="image/*" onChange={onFileChange} />
        )}
      </div>

      <div className="backgrounds_main">
        <CardList items={state.list} activeKey={0} />
      </div>
    </div>
  );
};

export default Backgrounds;
