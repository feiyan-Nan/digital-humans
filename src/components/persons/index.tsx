import React from 'react';
import { useAsyncEffect, useSetState, useBoolean } from 'ahooks';
import { MacScrollbar } from 'mac-scrollbar';
import { message, Spin } from 'antd';
import { shallow } from 'zustand/shallow';
import AutoTabs from '@/components/auto-tabs';
import CardList from '@/components/card-list';
import TipAndUpload from '@/components/tipAndUpload';
import api from '@/api';
import useStore from '@/store';
import './index.scss';

// type Item = { url: string; text?: string | undefined; id: number; digitalId: number; enable: boolean };

type IProps = {
  tabActiveKey: number;
  list: any[];
  onTabChange?: (activeKey: number) => void;
  refreshPerson?: () => void;
};

type IStates = {
  activeKey: number;
  personItems: any[];
  tabItems: string[];
  cardListActiveKey: number;
};

const Persons: React.FC<IProps> = ({ list, tabActiveKey, onTabChange, refreshPerson }) => {
  const [state, setState] = useSetState<IStates>({
    activeKey: tabActiveKey,

    personItems: list,

    tabItems: ['公用数字人', '定制数字人'],

    cardListActiveKey: -1,
  });

  const { updatePerson, selectedPerson, updateDigitalImage } = useStore(
    ({ updatePerson, selectedPerson, updateDigitalImage }) => ({ updatePerson, selectedPerson, updateDigitalImage }),
    shallow,
  );

  useAsyncEffect(async () => setState({ personItems: list }), [list]);

  useAsyncEffect(async () => {
    const cardListActiveKey = state.personItems.findIndex((i) => i.digitalId === selectedPerson.digitalId);
    setState({ cardListActiveKey });
  }, [state.personItems, selectedPerson]);

  useAsyncEffect(async () => {
    setState({ activeKey: tabActiveKey });
  }, [tabActiveKey]);

  const toCreateDigital = () => onTabChange && onTabChange(1);

  const [uploadVideoIng, { setTrue: showSpin, setFalse: hideSpin }] = useBoolean(false);

  const onFileChange = async (formData: FormData) => {
    console.log('AT-[ onFileChange &&&&&********** ]', formData);

    const key = 'loading';

    message.loading({
      content: '上传中',
      key,
      duration: 0,
    });

    showSpin();

    const res = await api.uploadVideoFile(formData);

    message.destroy(key);

    hideSpin();

    if (res.code === 200) {
      message.success(res.data.message);
      console.log('refreshPerson?.();');
      refreshPerson?.();
    }

    setState({ activeKey: 0 });

    setTimeout(() => setState({ activeKey: 1 }), 10);
  };

  const onChange = (data: any) => {
    updateDigitalImage(data?.url);
    updatePerson(data);
  };

  const onDelete = async (item: { id: number }) => {
    const key = 'deleteing';

    message.loading({ content: '删除中', duration: 0, key });
    api
      .deletePerson({ assetId: item.id })
      .then((r) => {
        r.code === 200 && message.success('删除成功');
        refreshPerson && refreshPerson();
      })
      .catch((err) => {
        message.error('删除失败');
      })
      .finally(() => {
        message.destroy(key);
      });
  };

  const onEdit = async (item: any) => {
    const key = 'updatePersonAssetName';

    message.loading({ content: '更改名称中', key, duration: 0 });

    api.updatePersonAssetName({ digitalPersonAssetsId: item.digitalId, name: item.newValue }).then((res) => {
      message.destroy(key);
      if (res.code === 200) {
        message.success('更改成功');
        refreshPerson?.();
      } else {
        message.error('更改失败');
      }
    });
  };

  return (
    <div className="persons">
      <div className="persons_header">
        <AutoTabs
          items={state.tabItems}
          onTabChange={onTabChange}
          activeKey={state.activeKey}
          style={{ paddingRight: '8px' }}
        />

        {state.activeKey === 0 ? (
          <div className="persons_tip">
            没有合适的数字人？
            <span className="persons_btn" onClick={toCreateDigital}>
              去定制
            </span>
          </div>
        ) : (
          <>
            <TipAndUpload
              tip="我们也支持上传上传音频驱动数字人，时长5分钟以内，格式支持MP3格式。"
              style={{ fontSize: '12px', lineHeight: '20px' }}
              btnText="上传视频"
              accept="video/*"
              onChange={onFileChange}
            />

            <AutoTabs items={['我的数字人']} key="travel" hideStatus />
          </>
        )}
      </div>

      <MacScrollbar>
        <CardList
          items={state.personItems}
          activeKey={state.cardListActiveKey}
          editable={state.activeKey === 1}
          onChange={onChange}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </MacScrollbar>
    </div>
  );
};

export default Persons;
