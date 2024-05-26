import React, { useEffect } from 'react';
import { Layout, Input, Spin } from 'antd';
import { useSetState, useAsyncEffect, useRequest, useMount } from 'ahooks';
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

import api from '@/api';

const { Sider, Content, Header, Footer } = Layout;
const { TextArea } = Input;

const sliderStyle: React.CSSProperties = {
  padding: 0,
  margin: 0,
  background: '#0D1530',
  // paddingRight: '7px',
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
  persons: any[];
  voices: any[];
  videos: any[];
};

const ISlide: React.FC = () => {
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
  });

  // 数字人列表
  const { loading: personLoading, run: personRun } = useRequest(api.getPersonList, {
    manual: true,

    onSuccess(res) {
      setState({ persons: res.result });
    },
  });

  // 背景图列表
  const { loading: bgLoading, run: bgRun } = useRequest(api.getBackgroundList, {
    manual: true,

    onSuccess(res) {
      setState({ backgrounds: res.result });
    },
  });

  // 音色列表
  const { loading: voiceLoading, run: voiceRun } = useRequest(api.getAudioList, {
    manual: true,

    onSuccess(res) {
      setState({ voices: res.result });
    },
  });

  // 视频列表
  const { loading: videoLoading, run: videoRun } = useRequest(api.getVideoList, {
    manual: true,

    onSuccess(res) {
      setState({ videos: res.result });
    },
  });

  useMount(() => {
    videoRun();
  });

  useAsyncEffect(async () => {
    if (state.activeNum === 0) personRun();
    if (state.activeNum === 1) bgRun();
    if (state.activeNum === 2) voiceRun();
    setState({ siderLoading: bgLoading });
  }, [state.activeNum]);

  useAsyncEffect(async () => {
    const siderLoading = personLoading && bgLoading && voiceLoading && videoLoading;

    setState({ siderLoading });
  }, [bgLoading, personLoading, voiceLoading, videoLoading]);

  const changeNav = (activeNum: number) => setState({ activeNum });

  return (
    <Layout>
      <Header style={headerStyle}>
        <div className="custom_header">
          <div className="logo_custom">
            <img src={logo} alt="" />
          </div>

          <div className="edit_name">
            未命名草稿 <img src={edit} alt="" />
          </div>

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
                {state.activeNum === 0 ? <Persons /> : null}

                {state.activeNum === 1 ? <Backgrounds list={state.backgrounds} /> : null}

                {state.activeNum === 2 ? <Voices /> : null}
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
                    <AutoTabs
                      items={['文字播报', '音频播报']}
                      onChange={(num) => {
                        console.log('onChange', num);
                      }}
                      activeNum={0}
                      mode="night"
                    />

                    <TextArea
                      showCount
                      maxLength={5000}
                      placeholder="请输入文字"
                      style={{ height: 200, resize: 'none', marginTop: '20px', padding: 0, border: 'none' }}
                    />
                  </div>

                  <div className="save">保存并生成播报</div>

                  {state.videos.length ? (
                    <div className="block">
                      <AutoTabs items={['视频列表', '']} mode="night" />
                    </div>
                  ) : null}
                </div>

                <div className="right_box_footer">
                  <div className="video_list">
                    {state.videos.map((item, index) => (
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
export default ISlide;
