import React from 'react';
import { Layout, Select, Space } from 'antd';
// import { Routes, Route } from 'react-router-dom';

import './index.scss';
import icon from '@/static/icons/icon.png';
import edit from '@/static/icons/edit.png';
import img from '@/static/imgs/test.png';
import logo from '@/static/imgs/logo.png';
import uploadIcon from '@/static/icons/uploadIcon.png';
import vector from '@/static/icons/vector.png';
import Video from '@/pages/video';

const { Sider, Content, Header, Footer } = Layout;

const sliderStyle: React.CSSProperties = {
  padding: 0,
  margin: 0,
  background: '#0D1530',
  // paddingRight: '7px',
};

const contentStyle: React.CSSProperties = {
  minHeight: 'calc(100vh - 54px)',
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
};

const ISlide: React.FC = () => (
  <Layout>
    <Header style={headerStyle}>
      <div className="header">
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
            <ul className="nav">
              <li className="nav-item">
                <img src={icon} alt="" />
                <span className="text">数字人</span>
              </li>

              <li className="nav-item active">
                <img src={icon} alt="" />
                <span className="text">数字人</span>
              </li>
            </ul>
          </Sider>

          <Content style={contentStyle}>
            <div className="sub_nav">
              <div className="sub_nav_header">
                <div className="sub_nav_header_item active">默认背景</div>
                <div className="sub_nav_header_item">自定义</div>
              </div>

              <div className="sub_nav_line">
                <div className="sub_nav_line_light" />
              </div>

              <div className="sub_nav_main">
                <div className="sub_nav_main_body">
                  <div className="sub_nav_main_item">
                    <img src={img} alt="" />
                  </div>

                  <div className="sub_nav_main_item active">
                    <img src={img} alt="" />
                  </div>

                  <div className="sub_nav_main_item">
                    <img src={img} alt="" />
                  </div>

                  <div className="sub_nav_main_item">
                    <img src={img} alt="" />
                  </div>

                  <div className="sub_nav_main_item">
                    <img src={img} alt="" />
                  </div>

                  <div className="sub_nav_main_item">
                    <img src={img} alt="" />
                  </div>

                  <div className="sub_nav_main_item">
                    <img src={img} alt="" />
                  </div>
                </div>
              </div>

              <div className="sub_nav_footer">
                <div className="sub_nav_header">
                  <div className="sub_nav_header_item active">默认背景</div>
                  <div className="sub_nav_header_item">自定义</div>
                </div>

                <div className="sub_nav_line">
                  <div className="sub_nav_line_light" />
                </div>

                <div className="sub_nav_tips">我们也支持上传上传音频驱动数字人，时长5分钟以内，格式支持MP3格式。</div>

                <div className="sub_nav_btn">
                  <img src={uploadIcon} alt="" />
                  上传图片
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Sider>

      <Layout>
        <Content>
          {/* <div className="right">右边的内容</div> */}

          <Layout style={{ height: 'calc(100% - 80px)' }}>
            <Content>
              <Video />
            </Content>
            <Sider className="right_sider">Sider</Sider>
          </Layout>

          <Footer className="custom_footer">
            <Space>
              画面比例
              <Select
                defaultValue="jack"
                style={{ width: 100 }}
                options={[
                  { value: 'jack', label: '9:16' },
                  { value: 'lucy', label: '16:9' },
                ]}
              />
            </Space>
          </Footer>
        </Content>
      </Layout>
    </Layout>
  </Layout>
);

export default ISlide;
