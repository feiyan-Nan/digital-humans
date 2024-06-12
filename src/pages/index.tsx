import React from 'react';
import { Layout, Spin, message } from 'antd';
import { useSetState, useAsyncEffect, useRequest } from 'ahooks';
import classNames from 'classnames';

import './index.scss';

import voiceIcon from '@/static/icons/voice.png';
import personsIcon from '@/static/icons/persons.png';
import imagesIcon from '@/static/icons/images.png';
// import img from '@/static/imgs/test.png';
import logo from '@/static/imgs/logo.png';
import vector from '@/static/icons/vector.png';
import homeIcon from '@/static/icons/home_icon.png';
import Video from '@/pages/video';

import AutoTabs from '@/components/auto-tabs';
import AspectRatio from '@/components/AspectRatio';
import LocationInformation from '@/components/LocationInformation';

import Persons from '@/components/persons';
import Backgrounds from '@/components/backgrounds';
import Voices from '@/components/voices';

import api from '@/api';
import InlineEdit from '@/components/InlineEdit';
import WordsOrSounds from '@/components/wordsOrSounds';

const { Sider, Content, Header, Footer } = Layout;
// const { TextArea } = Input;

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
  wordsOrSoundsActiveKey: TabsEnum;

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

    wordsOrSoundsActiveKey: TabsEnum.private,

    defaultEditStatus: false,
  });

  // 数字人接口请求
  const { loading: personListLoading, run: getPersonList } = useRequest(
    (personsActiveKey: TabsEnum) =>
      personsActiveKey === TabsEnum.public ? api.getFreePersonList() : api.getSuccessPersonList(),
    {
      manual: true,

      onSuccess(res) {
        const persons = res.data.map(({ avatarUrl: url, digitalId: id, name: text, ...rest }) => ({
          url,
          id,
          text,
          ...rest,
        }));
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

      onSuccess(res) {
        const voices = res.data.map(({ previewPictureUrl, ...rest }) => ({ ...rest, url: previewPictureUrl }));

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

  const { loading: videoLoading, run: getVideoList } = useRequest(api.getVideoList, {
    manual: true,

    onSuccess(res) {
      setState({ videos: res.data });
    },
  });

  useAsyncEffect(async () => {
    getVideoList();
  }, []);

  /** 触发接口请求 */
  useAsyncEffect(async () => {
    if (state.activeNum === 0) {
      if (state.personsActiveKey === 1) {
        getPersonList(state.personsActiveKey);
      } else if (!state.persons.length) {
        getPersonList(state.personsActiveKey);
      }
    }
    if (state.activeNum === 1) {
      !state.backgrounds.length && getBgList(state.bgActiveKey);
    }
    if (state.activeNum === 2) {
      !state.voices.length && getAudioList(state.voiceActiveKey);
    }
  }, [state.activeNum]);

  /** 切换loading状态 */
  useAsyncEffect(async () => {
    const siderLoading = personListLoading || voiceLoading || bgLoading;

    setState({ siderLoading });
  }, [personListLoading, voiceLoading, bgLoading]);

  const changeNav = (activeNum: number) => setState({ activeNum });

  const onNameChange = (name: string) => {
    console.log(name);
  };

  const toHomePage = () => {
    window.location.href = 'https://www.baidu.com/';
  };

  const onUploadBgSuccess = () => {
    getBgList(TabsEnum.private);
  };

  const onWordsOrSoundsTabChange = (wordsOrSoundsActiveKey: number) => {
    setState({
      wordsOrSoundsActiveKey,
    });
  };

  const handleOnSave = () => {
    console.log('AT-[ handleOnSave &&&&&********** ]');
    message.success('handleOnSave');
  };

  return (
    <Layout>
      <Header style={headerStyle}>
        <div className="custom_header">
          <div className="logo_custom" onClick={toHomePage}>
            <img src={homeIcon} alt="" className="home_icon" />
            <img src={logo} alt="" className="logo_icon" />
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
                  />
                )}

                {state.activeNum === 1 && (
                  <Backgrounds
                    list={state.backgrounds}
                    onTabChange={onBgTabChange}
                    tabActiveKey={state.bgActiveKey}
                    whenUploadSuccess={onUploadBgSuccess}
                  />
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
                    <WordsOrSounds tabActiveKey={state.wordsOrSoundsActiveKey} onTabChange={onWordsOrSoundsTabChange} />
                  </div>

                  <div className="save" onClick={handleOnSave}>
                    保存并生成播报
                  </div>

                  {!state.videos.length && (
                    <div className="block">
                      <AutoTabs items={['视频列表']} textMode="black" />
                    </div>
                  )}
                </div>

                <div className="right_box_footer">
                  <div className="video_list">
                    {state.videos.map((item) => (
                      <div className="video_item" key={item.digitalPersonWorksId}>
                        <img src={item.previewPictureUrl} alt="" className="thumbnail" />
                        <div className="video_info">
                          <div className="video_name">{item.videoName}</div>
                          <div className="video_status">状态：{item.status}</div>
                          <div className="video_time">{item.createTime}</div>
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
