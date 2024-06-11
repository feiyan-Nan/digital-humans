import React from 'react';
import { useAsyncEffect, useSetState } from 'ahooks';
import AutoTabs from '@/components/auto-tabs';
import UploadButton from '@/components/upload-button';
import CardList from '@/components/card-list';
import api from '@/api';

import './index.scss';
import img from '@/static/imgs/test.png';

type IProps = {
  tabActiveKey: number;
  list: { url: string; text?: string | undefined; id: number }[];
  onTabChange?: (activeKey: number) => void;
};

type IStates = {
  activeKey: number;
  personItems: { url: string; text?: string | undefined; id: number }[];
};

const Persons: React.FC<IProps> = ({ list, tabActiveKey, onTabChange }) => {
  useAsyncEffect(async () => {
    console.log('打印一次zzzzzzzzzzzzzzzzz');
  }, []);
  const [state, setState] = useSetState<IStates>({
    activeKey: tabActiveKey,

    personItems: list,
  });

  useAsyncEffect(async () => setState({ personItems: list }), [list]);

  const handleOnTabChange = (activeKey: number) => {
    if (activeKey !== state.activeKey) {
      setState({ activeKey });
      onTabChange && onTabChange(activeKey);
    }
  };

  const toCreateDigital = () => handleOnTabChange(1);

  const uploadFileChange = async (formData: FormData) => {
    const res = await api.uploadVideoFile(formData);

    const r = await api.makrPerson({
      description: '测试数字人描述',
      name: '测试数字人名称',
      trainVideo: res.result,
    });

    console.log('AT-[ r &&&&&********** ]', r);
  };

  return (
    <div className="sub_nav">
      <AutoTabs items={['公用数字人', '定制数字人']} activeKey={state.activeKey} onTabChange={handleOnTabChange} />

      {state.activeKey === 0 ? (
        <>
          <div className="persons_tip">
            没有合适的数字人？
            <span className="persons_btn" onClick={toCreateDigital}>
              去定制
            </span>
          </div>

          {state.personItems.length ? <CardList items={state.personItems} activeKey={0} /> : null}
        </>
      ) : (
        <>
          <div className="sub_nav_footer">
            <div className="sub_nav_tips">我们也支持上传上传音频驱动数字人，时长5分钟以内，格式支持MP3格式。</div>

            <UploadButton text="上传视频" accept="video/*" onChange={uploadFileChange} />
          </div>

          <AutoTabs items={['我的数字人']} key="travel" />

          <CardList
            items={[
              { url: img, text: 'text1', id: 4 },
              { url: img, text: 'text1', id: 5 },
              { url: img, text: 'text1', id: 6 },
            ]}
            activeKey={0}
          />
        </>
      )}
    </div>
  );
};

export default Persons;
