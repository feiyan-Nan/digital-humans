import React from 'react';
import { Layout, Spin, message, Modal } from 'antd';
import { useSetState, useAsyncEffect, useRequest, useBoolean } from 'ahooks';
import classNames from 'classnames';

import './index.scss';

import { shallow } from 'zustand/shallow';
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

import useStore from '@/store';

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
  persons: { url: string; text?: string | undefined; id: number; digitalId: number; enable: boolean }[];
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

  const [createVideoIng, { setTrue, setFalse }] = useBoolean(false);

  const { selectedPerson, updatePerson, selectedBackground, updateBackground, selectedVoice, updateVoice } = useStore(
    ({ selectedPerson, updatePerson, selectedBackground, updateBackground, selectedVoice, updateVoice }) => ({
      selectedPerson,
      updatePerson,

      selectedBackground,
      updateBackground,

      selectedVoice,
      updateVoice,
    }),
    shallow,
  );

  // 数字人接口请求
  const { loading: personListLoading, run: getPersonList } = useRequest(
    (personsActiveKey: TabsEnum) =>
      personsActiveKey === TabsEnum.public ? api.getFreePersonList() : api.getSuccessPersonList(),
    {
      manual: true,

      onSuccess(res) {
        const maskMap = new Map([
          ['FAIL', '定制失败'],
          ['IN_PROGRESS', '定制中'],
          ['SUCCESS', undefined],
        ]);

        const persons = res.data.map(({ avatarUrl: url, digitalId, name: text, status, ...rest }) => ({
          url,
          id: digitalId,
          text,
          digitalId,
          mask: status ? maskMap.get(status) : undefined,
          enable: status === undefined || status === 'SUCCESS',
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

  const refreshPerson = () => {
    getPersonList(state.personsActiveKey);
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

  // 获取已生成的视频
  const { loading: videoLoading, run: getVideoList } = useRequest(api.getVideoList, {
    manual: true,

    onSuccess(res) {
      const statusMap = new Map([
        ['SUCCESS', '已完成'],
        ['DRAFT', '草稿'],
        ['FAIL', '失败'],
        ['IN_PROGRESS', '制作中'],
      ]);

      setState({
        videos: res.data.map((i) => ({ ...i, statusText: statusMap.get(i.status) })),
      });
    },
  });

  useAsyncEffect(async () => {
    getVideoList();
  }, []);

  useAsyncEffect(async () => {
    getPersonList(0);

    getBgList(0);

    getAudioList(0);
  }, []);

  /** 触发接口请求 */
  useAsyncEffect(async () => {
    if (state.activeNum === 0) {
      !state.persons.length && getPersonList(state.personsActiveKey);
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

  // 监测数据获取状态，赋全局默认值
  useAsyncEffect(async () => {
    !selectedPerson && state.persons.length && updatePerson(state.persons[0]);
  }, [state.persons]);

  useAsyncEffect(async () => {
    !selectedBackground && state.backgrounds.length && updateBackground(state.backgrounds[0]);
  }, [state.backgrounds]);

  useAsyncEffect(async () => {
    !selectedVoice && state.voices.length && updateVoice(state.voices[0]);
  }, [state.voices]);

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

    setTrue();

    setTimeout(setFalse, 3000);
  };

  const previewVideo = (mp4Path: string) => {
    Modal.success({
      title: '视频预览',
      content: (
        <div>
          <video src={mp4Path} width="300px" autoPlay />
        </div>
      ),

      okText: '确定',
    });
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
                    refreshPerson={refreshPerson}
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
                <Spin spinning={createVideoIng}>
                  <div className="right_box_header">
                    <div className="block">
                      <WordsOrSounds
                        tabActiveKey={state.wordsOrSoundsActiveKey}
                        onTabChange={onWordsOrSoundsTabChange}
                      />
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
                </Spin>

                <div className="right_box_footer">
                  <div className="video_list">
                    {state.videos.map((item) => (
                      <div className="video_item" key={item.digitalPersonWorksId}>
                        <img src={item.previewPictureUrl} alt="" className="thumbnail" />
                        <div className="video_info">
                          <div className="video_name">{item.videoName}</div>
                          <div className="video_status">状态：{item.statusText}</div>
                          <div className="video_time">{item.createTime}</div>
                          <div className="video_actions">
                            <div className="video_btn" onClick={() => previewVideo(item.url)}>
                              播放
                            </div>
                            {/* <div className="video_btn">下载</div>
                            <div className="video_btn">删除</div> */}
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
