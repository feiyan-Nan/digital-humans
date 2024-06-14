import React from 'react';
import { useAsyncEffect, useSetState } from 'ahooks';
import { Scrollbars } from 'react-custom-scrollbars';
import { message } from 'antd';
import { shallow } from 'zustand/shallow';
import AutoTabs from '@/components/auto-tabs';
import CardList from '@/components/card-list';
import TipAndUpload from '@/components/tipAndUpload';
import api from '@/api';
import useStore from '@/store';
import './index.scss';

type Item = { url: string; text?: string | undefined; id: number; digitalId: number; enable: boolean };

type IProps = {
  tabActiveKey: number;
  list: Item[];
  onTabChange?: (activeKey: number) => void;
  refreshPerson?: () => void;
};

type IStates = {
  activeKey: number;
  personItems: Item[];
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
      refreshPerson && refreshPerson();
    }
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
    console.log('AT-[ onEdit ---------     xxxxx    &&&&&********** ]', item);

    const key = 'updatePersonAssetName';

    message.loading({ content: '更改名称中', key, duration: 0 });

    api.updatePersonAssetName({ digitalPersonAssetsId: item.digitalId, name: item.newValue }).then((res) => {
      console.log('AT-[ res &&&&&********** ]', res);
      message.destroy(key);
      if (res.code === 200) {
        message.success('更改成功');
      } else {
        message.error('更改失败');
      }
    });
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

      {/* <div className="persons_main"> */}
      <Scrollbars universal>
        <CardList
          items={state.personItems}
          activeKey={state.cardListActiveKey}
          editable={state.activeKey === 1}
          onChange={onChange}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </Scrollbars>
      {/* </div> */}
    </div>
  );
};

export default Persons;
