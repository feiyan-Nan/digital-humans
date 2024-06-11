import React from 'react';
import { Layout, Input, Spin } from 'antd';
import { useSetState, useAsyncEffect, useRequest } from 'ahooks';
import classNames from 'classnames';

import './index.scss';
// import axios from 'axios';

import voiceIcon from '@/static/icons/voice.png';
import personsIcon from '@/static/icons/persons.png';
import imagesIcon from '@/static/icons/images.png';
import edit from '@/static/icons/edit.png';
import img from '@/static/imgs/test.png';
import logo from '@/static/imgs/logo.png';
import vector from '@/static/icons/vector.png';
import Video from '@/pages/video';

import AutoTabs from '@/components/auto-tabs';
import AspectRatio from '@/components/AspectRatio';
import LocationInformation from '@/components/LocationInformation';

import Persons from '@/components/persons';
import Backgrounds from '@/components/backgrounds';
import Voices from '@/components/voices';
import EditInput from '@/components/edit-input';

import api from '@/api';
import InlineEdit from '@/components/InlineEdit';

const { Sider, Content, Header, Footer } = Layout;
const { TextArea } = Input;

const sliderStyle: React.CSSProperties = {
  padding: 0,
  margin: 0,
  background: '#0D1530',
};

const contentStyle: React.CSSProperties = {
  // minHeight: 'calc(100vh - 54px)',
  color: '#fff',
  background: '#0D1530',
  overflowY: 'scroll',
  padding: '0 18px 0 7px',
};

const headerStyle: React.CSSProperties = {
  background: '#fff',
  color: '#fff',
  margin: 0,
  padding: 0,
  height: '54px',
};

type IStates = {
  navs: { icon: string; text: string }[];
  activeNum: number;
  backgrounds: { url: string; backgroundId: number }[];
  siderLoading: boolean;
  loading: { backgrounds: boolean; digital: boolean; voice: boolean; sider: boolean };
  persons: { url: string; text?: string | undefined; id: number }[];
  voices: any[];
  videos: any[];

  personsActiveKey: TabsEnum;
  bgActiveKey: TabsEnum;
  voiceActiveKey: TabsEnum;
  defaultEditStatus: boolean;

  // freePersonList: { url: string; text?: string | undefined; id: number }[];
};

enum TabsEnum {
  public = 0,
  private = 1,
}

const IIndex: React.FC = () => {
  const [state, setState] = useSetState<IStates>({
    navs: [
      {
        icon: personsIcon,
        text: '数字人',
      },
      {
        icon: imagesIcon,
        text: '背景图',
      },
      {
        icon: voiceIcon,
        text: '声音',
      },
    ],
    backgrounds: [],
    activeNum: 0,
    siderLoading: false,
    loading: { backgrounds: false, digital: false, voice: false, sider: false },
    persons: [],
    voices: [],
    videos: [],
    personsActiveKey: TabsEnum.public,
    bgActiveKey: TabsEnum.public,
    voiceActiveKey: TabsEnum.public,
    defaultEditStatus: false,
  });

  // 数字人接口请求
  const { loading: personListLoading, run: getPersonList } = useRequest(
    (personsActiveKey: TabsEnum) =>
      personsActiveKey === TabsEnum.public ? api.getFreePersonList() : api.getSuccessPersonList(),
    {
      manual: true,

      loadingDelay: 1000,

      onSuccess(res) {
        console.log('AT-[ res &&&&&********** ]', res);
        const persons = res.data.map(({ avatarUrl: url, digitalId: id }) => ({ url, id }));
        setState({ persons });
      },
    },
  );

  // 数字人内部tab切换
  const onPersonsTabChange = (personsActiveKey: TabsEnum) => {
    if (state.personsActiveKey !== personsActiveKey) {
      getPersonList(personsActiveKey);
      setState({ personsActiveKey });
    }
  };

  // 背景列表
  const { loading: bgLoading, run: getBgList } = useRequest(
    (bgActiveKey) => (bgActiveKey === TabsEnum.public ? api.getFreeBackgroundList() : api.getUploadBackgroundList()),
    {
      manual: true,

      loadingDelay: 1000,

      onSuccess(res) {
        setState({ backgrounds: res.data });
      },
    },
  );

  const onBgTabChange = (bgActiveKey: TabsEnum) => {
    if (bgActiveKey !== state.bgActiveKey) {
      getBgList(bgActiveKey);
      setState({ bgActiveKey });
    }
  };

  // 音色列表
  const { loading: voiceLoading, run: getAudioList } = useRequest(
    (voiceActiveKey: TabsEnum) =>
      voiceActiveKey === TabsEnum.public ? api.getAudioFreeList() : api.getCustomAudioList(),
    {
      manual: true,

      loadingDelay: 5000,

      onSuccess(res) {
        const voices = res.data.map(({ audioDisplayUrl, ...rest }) => ({ ...rest, url: audioDisplayUrl }));

        setState({ voices });
      },
    },
  );

  const onAudioTabChange = (voiceActiveKey: TabsEnum) => {
    if (voiceActiveKey !== state.voiceActiveKey) {
      getAudioList(voiceActiveKey);
      setState({ voiceActiveKey });
    }
  };

  /** 触发接口请求 */
  useAsyncEffect(async () => {
    if (state.activeNum === 0) getPersonList(state.personsActiveKey);
    if (state.activeNum === 1) getBgList(state.bgActiveKey);
    if (state.activeNum === 2) getAudioList(state.voiceActiveKey);

    // setState({ siderLoading: bgLoading });
  }, [state.activeNum]);

  /** 切换loading状态 */
  useAsyncEffect(async () => {
    const siderLoading = !!(personListLoading && voiceLoading && bgLoading);

    setState({ siderLoading });
  }, [personListLoading, voiceLoading, bgLoading]);

  const changeNav = (activeNum: number) => setState({ activeNum });
  const onNameChange = (name: string) => {
    console.log(name);
  };

  const handleEdit = () => setState({ defaultEditStatus: true });

  return (
    <Layout>
      <Header style={headerStyle}>
        <div className="custom_header">
          <div className="logo_custom">
            <img src={logo} alt="" />
          </div>

          <div className="edit_name">
            <EditInput text="未命名草稿" defaultEditStatus={state.defaultEditStatus} />
            <img src={edit} onClick={handleEdit} alt="" />
          </div>
          <InlineEdit name="未命名草稿" onChange={onNameChange} />

          <div className="account">
            <img src={vector} alt="" />
          </div>
        </div>
      </Header>

      <Layout>
        <Sider width="278px">
          <Layout>
            <Sider style={sliderStyle} width="80px">
              <div className="nav">
                {state.navs.map((item, index) => (
                  <div
                    className={classNames('nav-item', index === state.activeNum ? 'active' : null)}
                    key={item.text}
                    onClick={() => changeNav(index)}
                  >
                    <img src={item.icon} alt="" />
                    <span className="text">{item.text}</span>
                  </div>
                ))}
              </div>
            </Sider>

            <Content style={contentStyle}>
              <Spin spinning={state.siderLoading}>
                {state.activeNum === 0 && (
                  <Persons
                    tabActiveKey={state.personsActiveKey}
                    list={state.persons}
                    onTabChange={onPersonsTabChange}
                    key={Math.random()}
                  />
                )}

                {state.activeNum === 1 && (
                  <Backgrounds list={state.backgrounds} onTabChange={onBgTabChange} tabActiveKey={state.bgActiveKey} />
                )}

                {state.activeNum === 2 && (
                  <Voices list={state.voices} onTabChange={onAudioTabChange} tabActiveKey={state.voiceActiveKey} />
                )}
              </Spin>
            </Content>
          </Layout>
        </Sider>

        <Layout>
          <Layout style={{ height: 'calc(100% - 80px)' }}>
            <Content>
              <Video />
            </Content>

            <Sider className="right_sider" width="256px">
              <div className="right_box">
                <div className="right_box_header">
                  <div className="block">
                    <AutoTabs items={['文字播报', '音频播报']} activeKey={0} textMode="black" />

                    <TextArea
                      showCount
                      maxLength={5000}
                      placeholder="请输入文字"
                      style={{ height: 200, resize: 'none', marginTop: '20px', padding: 0, border: 'none' }}
                    />
                  </div>

                  <div className="save">保存并生成播报</div>

                  {!state.videos.length ? (
                    <div className="block">
                      <AutoTabs items={['视频列表', '']} textMode="black" />
                    </div>
                  ) : null}
                </div>

                <div className="right_box_footer">
                  <div className="video_list">
                    {state.videos.map((item) => (
                      <div className="video_item" key={item.id}>
                        <img src={img} alt="" className="thumbnail" />
                        <div className="video_info">
                          <div className="video_name">未命名草稿</div>
                          <div className="video_status">状态：制作中</div>
                          <div className="video_time">2024-04-24 11:59:13</div>
                          <div className="video_actions">
                            <div className="video_btn">播放</div>
                            <div className="video_btn">下载</div>
                            <div className="video_btn">删除</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Sider>
          </Layout>

          <Footer className="custom_footer">
            <AspectRatio />
            <LocationInformation />
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default IIndex;
