import React from 'react';
import { Layout, message, Spin } from 'antd';
import {
  useAsyncEffect,
  useBoolean,
  useDebounceEffect,
  useRequest,
  useSetState,
  useCookieState,
  useTitle,
  useFavicon,
} from 'ahooks';
import classNames from 'classnames';
import { MacScrollbar } from 'mac-scrollbar';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import './index.scss';

import { shallow } from 'zustand/shallow';
import voiceIcon from '@/static/icons/voice.png';
import personsIcon from '@/static/icons/persons.png';
import imagesIcon from '@/static/icons/images.png';
import logo_home from '@/static/icons/homeText.svg';
import homeIcon from '@/static/icons/home.svg';
import logo from '@/static/icons/logo.svg';
import jfLogo from '@/static/icons/jf.png';

import vector from '@/static/icons/vector.png';
import Video from '@/pages/video';

import AutoTabs from '@/components/auto-tabs';
import AspectRatio from '@/components/AspectRatio';

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
  color: '#fff',
  background: '#0D1530',
  // padding: '0 18px 0 7px',
  padding: '0 10px 0 7px',
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
  backgrounds: ({ url: string; backgroundId: number } | null)[];
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

  localMp3Name: string | undefined;
};

enum TabsEnum {
  public = 0,
  private = 1,
}

export const jf = window.location.hostname.includes('jfworkbench');

const IIndex: React.FC = () => {
  const [state, setState] = useSetState<IStates>({
    navs: [
      {
        icon: personsIcon,
        text: '数字人',
      },

      {
        icon: voiceIcon,
        text: '声音',
      },

      {
        icon: imagesIcon,
        text: '背景图',
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
    localMp3Name: undefined,
  });

  const [createVideoIng, { setTrue: showCreateVideoLoading, setFalse: hideCreateVideoLoading }] = useBoolean(false);

  const {
    scale,
    locations,
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
      scale,
      locations,
    }) => ({
      scale,
      locations,
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

  const [token, setToken] = useCookieState('token');

  useAsyncEffect(async () => {
    setState({ currentName: currentName || state.initialName });
  }, [currentName]);

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
        const backgrounds = state.bgActiveKey === 0 ? [null, ...res.data] : res.data;

        setState({ backgrounds });
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

    pollingInterval: 10 * 1000,

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
  const { run: getDraftVideo } = useRequest(() => api.getDraftVideo(), {
    manual: true,
    onSuccess(res) {
      if (res.code === 200) {
        updateDraftData(res.data);

        const {
          selectedBackground: b,
          selectedPerson: p,
          selectedVoice: v,
          textContent: t,
          speechStr: s,
          currentName: c,
        } = res.data;

        b && updateBackground(b);
        p && updatePerson(p);
        v && updateVoice(v);
        t && updateTextContent(t);
        s && updateSpeedStr(s);
        c && updateCurrentName(c);

        setState({ isGetedDraft: true });
      }
    },
  });

  // 获取草稿
  useAsyncEffect(async () => {
    if (!token) {
      getPersonList(0);

      getBgList(0);

      getAudioList(0);

      // getVideoList();

      return;
    }

    if (!state.isGetedDraft) {
      getDraftVideo();
    }
  }, []);

  useAsyncEffect(async () => {
    if (state.isGetedDraft) {
      getBgList(0);

      getAudioList(0);

      getVideoList();
    }
  }, [state.isGetedDraft]);

  useAsyncEffect(async () => {
    if (!token) {
      if (state.personsActiveKey === 1 || state.bgActiveKey === 1 || state.voiceActiveKey === 1) {
        toLoginPage();
      }
    }
  }, [state.personsActiveKey, state.bgActiveKey, state.voiceActiveKey]);

  /** 触发接口请求 */
  useAsyncEffect(async () => {
    if (!state.isGetedDraft) return;

    if (state.activeNum === 0) {
      !state.persons.length && getPersonList(state.personsActiveKey);
    }

    if (state.activeNum === 1) {
      token && !state.backgrounds.length && getBgList(state.bgActiveKey);
    }
    if (state.activeNum === 2) {
      token && !state.voices.length && getAudioList(state.voiceActiveKey);
    }
  }, [state.activeNum, state.isGetedDraft]);

  /** 切换loading状态 */
  useAsyncEffect(async () => {
    const siderLoading = personListLoading || voiceLoading || bgLoading;

    setState({ siderLoading });
  }, [personListLoading, voiceLoading, bgLoading]);

  // 监测数据获取状态，赋全局默认值
  useAsyncEffect(async () => {
    !selectedPerson && state.persons.length && updatePerson(state.persons[0]);
  }, [state.persons, selectedPerson]);

  useAsyncEffect(async () => {
    updateDigitalImage(selectedPerson?.url);
  }, [selectedPerson]);

  useAsyncEffect(async () => {
    !selectedBackground && state.backgrounds.length && updateBackground(state.backgrounds[0]);
  }, [state.backgrounds]);

  useAsyncEffect(async () => {
    !selectedVoice && state.voices.length && updateVoice(state.voices[0]);
  }, [state.voices]);

  const { run: createDraftVideo } = useRequest(
    () =>
      api.createDraftVideo({
        selectedBackground,
        selectedPerson,
        selectedVoice,
        textContent,
        speechStr,
        currentName,
      }),
    {
      manual: true,
      onSuccess(res) {
        console.log('AT-[ createDraftVideo &&&&&********** ]', res);
      },
    },
  );

  // 创建草稿记录
  useDebounceEffect(
    () => {
      if (token) createDraftVideo();
    },
    [selectedBackground, selectedPerson, selectedVoice, textContent, speechStr, currentName],
    { wait: 1000 },
  );

  const changeNav = (activeNum: number) => setState({ activeNum });

  const onNameChange = (name: string) => {
    if (currentName !== name) {
      updateCurrentName(name);
    }
  };

  const toHomePage = () => {
    window.location.href = jf ? 'http://jf.aidigitalfield.com/' : 'https://aidigitalfield.com/';
  };

  const toLoginPage = () => {
    window.location.href = jf ? 'https://jflogin.aidigitalfield.com/' : 'https://login.aidigitalfield.com/';
  };

  useTitle(jf ? 'xxxxxxx' : 'VHOST主播工厂 - 个性化数字人定制专家');
  // useFavicon(jf ? '极场' : '艾迪数字);

  const onUploadBgSuccess = () => {
    getBgList(TabsEnum.private);
  };

  const onWordsOrSoundsTabChange = (wordsOrSoundsActiveKey: number) => {
    setState({ wordsOrSoundsActiveKey, audioUrl: '' });
  };

  const handleOnSave = () => {
    const { digitalId } = selectedPerson;
    const { templateId: voice } = selectedVoice;

    console.log('speechStr', speechStr);

    if (!token) {
      toLoginPage();
      return;
    }

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

    const { url } = selectedBackground || { url: '' };

    const options = { ...(state.wordsOrSoundsActiveKey === 0 ? { textContent } : { mediaUrl: state.audioUrl }) };

    const body = {
      ...options,
      name: currentName || state.initialName,
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
              rect: [locations.left / scale, locations.top / scale, locations.width / scale, locations.height / scale],
            },
          ],
        },
      ],
    };

    showCreateVideoLoading();

    api
      .createVideo(body)
      .then((res) => {
        console.log('AT-[ res &&&&&********** ]', res);
        if (res.code === 200) {
          getVideoList();
        }
      })
      .finally(() => {
        hideCreateVideoLoading();
        // 重新获取草稿
        getDraftVideo();
      });
  };

  const previewVideo = (mp4Path: string) => {
    const a = document.createElement('a');

    a.href = mp4Path;

    a.target = '_blank';

    a.style.display = 'none';

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    // Modal.success({
    //   title: '视频预览',
    //   content: (
    //     <div>
    //       <video src={mp4Path} width="300px" autoPlay />
    //     </div>
    //   ),

    //   okText: '确定',
    // });
  };

  const [uploadAudioIng, { setTrue: showUploadAudio, setFalse: hideUploadAudio }] = useBoolean(false);

  const onFileChange = async (formData: FormData, file: File) => {
    if (!token) {
      document.cookie = '';
      toLoginPage();
      return;
    }
    showUploadAudio();
    const res = await api.uploadAudio(formData);
    hideUploadAudio();
    if (res.code === 200) {
      setState({ audioUrl: res.data.url, localMp3Name: file.name });
    }
  };

  useAsyncEffect(async () => {
    setState({ audioUrl: '' });
  }, [state.wordsOrSoundsActiveKey]);

  const loginOrOut = async () => {
    // token ? setToken('') : (window.location.href = '//login.aidigitalfield.com/ ');
    if (token) {
      document.cookie = 'token=;domain=aidigitalfield.com';
      document.cookie = 'token=;domain=127.0.0.1;';
      document.cookie = 'token=;domain=*;';
      await api.logout();
      message.success('退出成功');
      window.location.reload();
    } else {
      window.location.href = jf ? '//jflogin.aidigitalfield.com' : '//login.aidigitalfield.com';
    }
  };

  const downloadVideo = (src: string, name: string) => {
    const videoName = `${name}.mp4`;

    axios({
      url: src,
      method: 'GET',
      responseType: 'blob', // 这里就是转化为blob文件流
    }).then((res) => {
      const href = URL.createObjectURL(res.data);
      const box = document.createElement('a');
      box.download = videoName;
      box.href = href;
      box.click();
    });
  };

  const handleOnDeleteVideo = async (item: any) => {
    message.loading({ content: '删除中' });
    const res = await api.deleteWork({ digitalPersonWorksId: item.digitalPersonWorksId });
    message.destroy();
    console.log('AT-[ res &&&&&********** ]', res);
    if (res.code === 200) {
      message.success(res.data);
    } else {
      message.warning(res.message);
    }

    getVideoList();
  };

  return (
    <Layout>
      <Header style={headerStyle}>
        <div className="custom_header">
          <div className="logo_custom" onClick={toHomePage}>
            <img src={homeIcon} alt="" className="home_icon" />
            <img src={jf ? jfLogo : logo} alt="" style={{ width: jf ? '100px' : '80%' }} className="logo_icon" />
            <img src={logo_home} alt="" className="logo_home" />
          </div>

          <InlineEdit name={state.currentName} onChange={onNameChange} />

          <div className="account">
            <img src={vector} alt="" />
            <div className="account_text" onClick={loginOrOut}>
              {token ? '退出' : '登录'}
            </div>
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
                  <Voices list={state.voices} onTabChange={onAudioTabChange} tabActiveKey={state.voiceActiveKey} />
                )}

                {state.activeNum === 2 && (
                  <Backgrounds
                    list={state.backgrounds}
                    onTabChange={onBgTabChange}
                    tabActiveKey={state.bgActiveKey}
                    whenUploadSuccess={onUploadBgSuccess}
                  />
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
                <Spin spinning={createVideoIng || uploadAudioIng}>
                  <div className="right_box_header">
                    <div className="block">
                      <WordsOrSounds
                        tabActiveKey={state.wordsOrSoundsActiveKey}
                        onTabChange={onWordsOrSoundsTabChange}
                        focus={state.textInputFocus}
                        onFileChange={onFileChange}
                        tip={state.audioUrl ? state.localMp3Name : undefined}
                        tipTextAlign={state.audioUrl && state.localMp3Name ? 'center' : 'left'}
                      />
                    </div>

                    {true && (
                      <div className="save" onClick={handleOnSave}>
                        保存并生成播报
                      </div>
                    )}
                    {state.videos.length ? (
                      <div className="block">
                        <AutoTabs items={['视频列表']} textMode="black" />
                      </div>
                    ) : null}
                  </div>
                </Spin>
                <MacScrollbar>
                  <div className="right_box_footer">
                    <div className="video_list">
                      {state.videos.map((item) => (
                        <div className="video_item" key={item.digitalPersonWorksId}>
                          <div className="thumbnail">
                            {/* <img src={item.previewPictureUrl} alt="" /> */}
                            <LazyLoadImage
                              width="100%"
                              effect="blur"
                              src={item.previewPictureUrl}
                              wrapperClassName="face"
                            />
                          </div>
                          <div className="video_info">
                            <div className="video_name">{item.videoName}</div>
                            <div className="video_status">状态：{item.statusText}</div>
                            <div className="video_time">{item.createTime}</div>
                            <div className="video_actions">
                              {/* {item.status === 'SUCCESS' ? (
                                <>
                                  <div className="video_btn" onClick={() => previewVideo(item.url)}>
                                    播放
                                  </div>

                                  <div className="video_btn" onClick={() => downloadVideo(item.url, item.videoName)}>
                                    下载
                                  </div>
                                </>
                              ) : null} */}

                              <div
                                className={classNames('video_btn', item.status !== 'SUCCESS' && 'disable')}
                                onClick={() => item.status === 'SUCCESS' && previewVideo(item.url)}
                              >
                                播放
                              </div>

                              <div
                                className={classNames('video_btn', item.status !== 'SUCCESS' && 'disable')}
                                onClick={() => item.status === 'SUCCESS' && downloadVideo(item.url, item.videoName)}
                              >
                                下载
                              </div>

                              <div
                                className={classNames(
                                  'video_btn',
                                  !['SUCCESS', 'FAIL'].includes(item.status) && 'disable',
                                )}
                                onClick={() => ['SUCCESS', 'FAIL'].includes(item.status) && handleOnDeleteVideo(item)}
                              >
                                删除
                              </div>
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
            {/* <LocationInformation /> */}
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default IIndex;
