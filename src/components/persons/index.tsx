import React from 'react';
import { useAsyncEffect, useSetState } from 'ahooks';
import { message } from 'antd';
import AutoTabs from '@/components/auto-tabs';
import CardList from '@/components/card-list';
import TipAndUpload from '@/components/tipAndUpload';
import api from '@/api';

import './index.scss';

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

  useAsyncEffect(async () => {
    setState({ activeKey: tabActiveKey });
  }, [tabActiveKey]);

  const toCreateDigital = () => onTabChange && onTabChange(1);

  const onFileChange = async (formData: FormData) => {
    const key = 'loading';

    message.loading({
      content: '上传中',
      key,
      duration: 0,
    });

    const res = await api.uploadVideoFile(formData);

    message.destroy(key);

    if (res.code !== 200) {
      message.error(res.data.message);
    } else {
      message.success(res.data.message);
    }
  };

  return (
    <div className="persons">
      <div className="persons_header">
        <AutoTabs items={state.tabItems} onTabChange={onTabChange} activeKey={state.activeKey} />

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
        <CardList items={state.personItems} activeKey={2} edit />
      </div>
    </div>
  );
};

export default Persons;
