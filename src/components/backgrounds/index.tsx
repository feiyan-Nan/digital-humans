import React from 'react';
import {useAsyncEffect, useSetState} from 'ahooks';
import {shallow} from 'zustand/shallow';
import {message} from 'antd';
import AutoTabs from '@/components/auto-tabs';
import CardList from '@/components/card-list';
import TipAndUpload from '@/components/tipAndUpload';
import './index.scss';

import api from '@/api';
import useStore from '@/store';

type IProps = {
  list: { url: string; backgroundId: number }[];
  onTabChange?: (activeKey: number) => void;
  tabActiveKey?: number;
  whenUploadSuccess: () => void;
};

type IState = {
  items: string[];
  tabActiveKey: number;
  list: { url: string; id: number; backgroundId: number }[];
  spinning: boolean;
  cardListActiveKey: number;
};

const Backgrounds: React.FC<IProps> = ({list, onTabChange, tabActiveKey = 0, whenUploadSuccess}) => {
  const [state, setState] = useSetState<IState>({
    items: ['默认背景', '自定义'],

    tabActiveKey,

    list: [],

    spinning: false,

    cardListActiveKey: -1,
  });

  const {selectedBackground, updateBackground, updateBackGroundImage} = useStore(
    ({updateBackground, selectedBackground, updateBackGroundImage}) => ({
      updateBackground,
      selectedBackground,
      updateBackGroundImage
    }),
    shallow,
  );

  useAsyncEffect(async () => {
    setState({
      list: list.map((i) => ({...i, id: i.backgroundId})),
    });
  }, [list]);

  useAsyncEffect(async () => {
    const cardListActiveKey = state.list.findIndex((i) => i.backgroundId === selectedBackground.backgroundId);

    setState({cardListActiveKey});
  }, [state.list, selectedBackground]);

  useAsyncEffect(async () => {
    setState({tabActiveKey});
  }, [tabActiveKey]);

  const validateImage = async (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const {width, height} = img;

          width / height === 0.5625 ? resolve(null) : reject();
        };

        img.src = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    });

  const onFileChange = async (formData: FormData, file: File) => {
    validateImage(file)
      .then(async () => {
        const uploadingKey = 'uploadingKey';

        message.loading({
          content: '上传中',
          key: uploadingKey,
        });

        await api.uploadBackgroundFile(formData);

        message.destroy(uploadingKey);

        whenUploadSuccess();
      })
      .catch(() => {
        message.error({
          content: '必须要9:16的图片',
          duration: 2,
        });
      });
  };

  const onChange = (data: any) => {
    updateBackground(data)
    updateBackGroundImage(data?.url)
  };

  return (
    <div className="backgrounds">
      <div className="backgrounds_header">
        <AutoTabs items={state.items} onTabChange={onTabChange} activeKey={state.tabActiveKey}/>

        {state.tabActiveKey === 1 && (
          <TipAndUpload tip="我们也支持上传自定义背景图" btnText="上传图片" accept="image/*" onChange={onFileChange}/>
        )}
      </div>

      <div className="backgrounds_main">
        <CardList items={state.list} onChange={onChange} activeKey={state.cardListActiveKey}/>
      </div>
    </div>
  );
};

export default Backgrounds;
