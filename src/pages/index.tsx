import React from 'react';
import { Layout, Input } from 'antd';
import { useSetState } from 'ahooks';
import classNames from 'classnames';

import './index.scss';
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

// import IButton from '@/components/button';
import Persons from '@/components/persons';
import Backgrounds from '@/components/backgrounds';
import Voices from '@/components/voices';

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

const ISlide: React.FC = () => {
  type IStates = {
    navs: { icon: string; text: string }[];
    activeNum: number;
  };

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

    activeNum: 0,
  });

  const changeNav = (activeNum: number) => {
    setState({ activeNum });
  };

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
              {state.activeNum === 0 ? <Persons /> : state.activeNum === 1 ? <Backgrounds /> : <Voices />}
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

                  <div className="block">
                    <AutoTabs
                      items={['视频列表', '']}
                      onChange={(num) => {
                        console.log('onChange', num);
                      }}
                      activeNum={0}
                      mode="night"
                    />
                  </div>
                </div>

                <div className="right_box_footer">
                  <div className="video_list">
                    <div className="video_item">
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

                    <div className="video_item">
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
                  </div>
                </div>
              </div>
            </Sider>
          </Layout>

          <Footer className="custom_footer">
            <AspectRatio />
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default ISlide;
