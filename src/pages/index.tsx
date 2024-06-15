import React from 'react';
import { Layout, message, Modal, Spin } from 'antd';
import { useAsyncEffect, useBoolean, useRequest, useSetState } from 'ahooks';
import classNames from 'classnames';
import { MacScrollbar } from 'mac-scrollbar';;

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

  initialName: string;
  currentName: string;

  textInputFocus: boolean;

  isGetedDraft: boolean;

  audioUrl: string;
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

    wordsOrSoundsActiveKey: TabsEnum.public,

    defaultEditStatus: false,

    initialName: '未命名草稿',
    currentName: '未命名草稿',

    textInputFocus: false,

    isGetedDraft: false,

    audioUrl: '',
  });

  const [createVideoIng, { setTrue: showCreateVideoLoading, setFalse: hideCreateVideoLoading }] = useBoolean(false);

  const {
    textContent,
    updateTextContent,
    selectedPerson,
    updatePerson,
    selectedBackground,
    updateBackground,
    selectedVoice,
    updateVoice,
    updateDigitalImage,
    currentName,
    updateCurrentName,

    speechStr,
    updateSpeedStr,

    draftData,
    updateDraftData,
  } = useStore(
    ({
      textContent,
      updateTextContent,
      selectedPerson,
      updatePerson,
      selectedBackground,
      updateBackground,
      selectedVoice,
      updateVoice,
      updateDigitalImage,
      currentName,
      updateCurrentName,
      speechStr,
      updateSpeedStr,
      draftData,
      updateDraftData,
    }) => ({
      textContent,
      updateTextContent,

      selectedPerson,
      updatePerson,

      selectedBackground,
      updateBackground,

      selectedVoice,
      updateVoice,

      updateDigitalImage,
      currentName,
      updateCurrentName,

      speechStr,
      updateSpeedStr,

      draftData,
      updateDraftData,
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

  // 获取草稿
  useAsyncEffect(async () => {
    if (!state.isGetedDraft) {
      const res = await api.getDraftVideo();

      if (res.code === 200) {
        setState({ isGetedDraft: true });

        updateDraftData(res.data);

        const {
          selectedBackground: b,
          selectedPerson: p,
          selectedVoice: v,
          textContent: t,
          speechStr: s,
          currentName: c,
        } = draftData;

        updateBackground(b);
        updatePerson(p);
        updateVoice(v);
        updateTextContent(t);
        updateSpeedStr(s);
        updateCurrentName(c);
      }
    }
  }, []);

  // useAsyncEffect(async () => {
  //   if (state.isGetedDraft) {
  //     getBgList(0);

  //     getAudioList(0);

  //     getVideoList();
  //   }
  // }, [state.isGetedDraft]);

  useAsyncEffect(async () => {
    getBgList(0);

    getAudioList(0);

    getVideoList();
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
    updateDigitalImage(selectedPerson?.url);
  }, [selectedPerson]);

  useAsyncEffect(async () => {
    !selectedBackground && state.backgrounds.length && updateBackground(state.backgrounds[0]);
  }, [state.backgrounds]);

  useAsyncEffect(async () => {
    !selectedVoice && state.voices.length && updateVoice(state.voices[0]);
  }, [state.voices]);

  // 创建草稿记录
  useAsyncEffect(async () => {
    const res = await api.createDraftVideo({
      selectedBackground,
      selectedPerson,
      selectedVoice,
      textContent,
      speechStr,
      currentName,
    });

    console.log('resres------------', res);
  }, [selectedBackground, selectedPerson, selectedVoice, textContent, speechStr, currentName]);

  const changeNav = (activeNum: number) => setState({ activeNum });

  const onNameChange = (name: string) => {
    if (currentName !== name) {
      updateCurrentName(name);
    }
  };

  const toHomePage = () => {
    window.location.href = 'https://aidigitalfield.com/';
  };

  const onUploadBgSuccess = () => {
    getBgList(TabsEnum.private);
  };

  const onWordsOrSoundsTabChange = (wordsOrSoundsActiveKey: number) => {
    setState({ wordsOrSoundsActiveKey });
  };

  const handleOnSave = () => {
    const { digitalId } = selectedPerson;
    const { templateId: voice } = selectedVoice;
    const { url } = selectedBackground;

    if (state.wordsOrSoundsActiveKey === 0) {
      if (!textContent) {
        message.error('请先输入文字播报内容');
        setState({ textInputFocus: false });

        setTimeout(() => setState({ textInputFocus: true }));
        return;
      }
    }

    if (state.wordsOrSoundsActiveKey === 1) {
      if (!state.audioUrl) {
        message.error('请先上传音频文件');
        return;
      }
    }

    const options = { ...(state.wordsOrSoundsActiveKey === 0 ? { textContent } : { audioUrl: state.audioUrl }) };

    const body = {
      ...options,
      name: currentName,
      voice,
      digitalId,
      speechStr, // 语速
      width: 1080,
      height: 1920,
      layers: [
        {
          repeat: 0, // 0 表示一直存在，1 表示短暂出现，出现的时长为 duration 定义；默认为0
          data: [
            {
              type: 'image',
              url,
              duration: 1000,
              rect: [
                0, // 左上 x
                0, // 左上 x
                1080, // 宽
                1920, // 高
              ],
            },
          ],
        },
        {
          repeat: 0,
          data: [
            {
              type: 'human',
              rect: [270, 500, 810, 1440],
            },
          ],
        },
      ],
    };

    showCreateVideoLoading();

    api
      .createWithTTS(body)
      .then((res) => {
        console.log('AT-[ res &&&&&********** ]', res);
        if (res.code === 200) {
          getVideoList();
        }
      })
      .finally(hideCreateVideoLoading);
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

  const onFileChange = async (formData: FormData) => {
    const res = await api.uploadAudio(formData);

    if (res.code === 200) {
      setState({ audioUrl: res.data });
    }
  };

  useAsyncEffect(async () => {
    setState({ audioUrl: '' });
  }, [state.wordsOrSoundsActiveKey]);

  return (
    <Layout>
      <Header style={headerStyle}>
        <div className="custom_header">
          <div className="logo_custom" onClick={toHomePage}>
            <img src={homeIcon} alt="" className="home_icon" />
            <img src={logo} alt="" className="logo_icon" />
          </div>

          <InlineEdit name={state.currentName} onChange={onNameChange} />

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
                        focus={state.textInputFocus}
                        onFileChange={onFileChange}
                      />
                    </div>

                    {true && (
                      <div className="save" onClick={handleOnSave}>
                        保存并生成播报
                      </div>
                    )}
                    {!state.videos.length && (
                      <div className="block">
                        <AutoTabs items={['视频列表']} textMode="black" />
                      </div>
                    )}
                  </div>
                </Spin>
                <MacScrollbar>
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
                </MacScrollbar>
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
