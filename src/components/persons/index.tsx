import React from 'react';
import { useAsyncEffect, useSetState } from 'ahooks';
import AutoTabs from '@/components/auto-tabs';
// import UploadButton from '@/components/upload-button';
import CardList from '@/components/card-list';
import TipAndUpload from '@/components/tipAndUpload';
import api from '@/api';

import './index.scss';
// import img from '@/static/imgs/test.png';

type IProps = {
  tabActiveKey: number;
  list: { url: string; text?: string | undefined; id: number }[];
  onTabChange?: (activeKey: number) => void;
};

type IStates = {
  activeKey: number;
  personItems: { url: string; text?: string | undefined; id: number }[];
  tabItems: string[];
};

const Persons: React.FC<IProps> = ({ list, tabActiveKey, onTabChange }) => {
  const [state, setState] = useSetState<IStates>({
    activeKey: tabActiveKey,

    personItems: list,

    tabItems: ['公用数字人', '定制数字人'],
  });

  useAsyncEffect(async () => setState({ personItems: list }), [list]);

  const handleOnTabChange = (activeKey: number) => {
    if (activeKey !== state.activeKey) {
      setState({ activeKey });
      onTabChange && onTabChange(activeKey);
    }
  };

  const toCreateDigital = () => handleOnTabChange(1);

  const onFileChange = async (formData: FormData) => {
    const res = await api.uploadVideoFile(formData);

    console.log('AT-[ res &&&&&********** ]', res);

    const r = await api.makrPerson({
      description: '测试数字人描述',
      name: '测试数字人名称',
      trainVideo: res.result,
    });

    console.log('AT-[ r &&&&&********** ]', r);
  };

  // const onFileChange = (formData: FormData) => {

  // }

  return (
    <div className="persons">
      <div className="persons_header">
        <AutoTabs items={state.tabItems} onTabChange={handleOnTabChange} key="persons" />

        {state.activeKey === 1 && (
          <>
            <TipAndUpload
              tip={
                <div className="persons_tip">
                  没有合适的数字人？
                  <span className="persons_btn" onClick={toCreateDigital}>
                    去定制
                  </span>
                </div>
              }
              btnText="上传视频"
              accept="video/*"
              onChange={onFileChange}
            />

            <AutoTabs items={['我的数字人']} key="travel" />
          </>
        )}
      </div>

      <div className="persons_main">
        <CardList items={state.personItems} activeKey={0} />
      </div>
    </div>
  );
};

export default Persons;
