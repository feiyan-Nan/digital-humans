import React from 'react';
import { useSetState, useAsyncEffect } from 'ahooks';
import { shallow } from 'zustand/shallow';
import { message } from 'antd';
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
  list: { url: string; id: number }[];
  spinning: boolean;
};

const Backgrounds: React.FC<IProps> = ({ list, onTabChange, tabActiveKey = 0, whenUploadSuccess }) => {
  const { scale, locations, updateDigitalImage, updateBackGroundImage } = useStore(
    (state) => ({
      scale: state.scale,
      locations: state.locations,
      updateDigitalImage: state.updateDigitalImage,
      updateBackGroundImage: state.updateBackGroundImage,
    }),
    shallow,
  );
  // const [messageApi] = message.useMessage();

  const [state, setState] = useSetState<IState>({
    items: ['默认背景', '自定义'],

    tabActiveKey,

    list: [],

    spinning: false,
  });

  useAsyncEffect(async () => {
    setState({
      list: list.map((i) => ({ ...i, id: i.backgroundId })),
    });
  }, [list]);

  useAsyncEffect(async () => {
    setState({ tabActiveKey });
  }, [tabActiveKey]);

  // const handleTabChange = (activeKey: number) => {
  //   if (activeKey !== state.tabActiveKey) {
  //     setState({ tabActiveKey: activeKey });
  //     onTabChange && onTabChange(tabActiveKey);
  //   }
  // };

  const validateImage = async (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const { width, height } = img;

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
    console.log(data, 'id');
    updateBackGroundImage(data?.url);
  };

  return (
    <div className="backgrounds">
      <div className="backgrounds_header">
        <AutoTabs items={state.items} onTabChange={onTabChange} activeKey={state.tabActiveKey} />

        {state.tabActiveKey === 1 && (
          <TipAndUpload tip="我们也支持上传自定义背景图" btnText="上传图片" accept="image/*" onChange={onFileChange} />
        )}
      </div>

      <div className="backgrounds_main">
        <CardList items={state.list} activeKey={0} onChange={onChange} />
      </div>
    </div>
  );
};

export default Backgrounds;
