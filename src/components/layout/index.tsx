import React from 'react';
import { Layout } from 'antd';
// import { Routes, Route } from 'react-router-dom';

import './index.scss';

const { Sider, Content } = Layout;

const ISlide: React.FC = () => {
  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,

    bottom: 0,

    width: '278px',
  };

  const contentStyle: React.CSSProperties = {
    // textAlign: 'center',
    minHeight: '100vh',
    // lineHeight: '120px',
    // color: '#fff',
    background: '#5C5C5C',
    color: 'red',
  };

  return (
    <Layout>
      <Sider style={siderStyle}>
        <Layout>
          <Sider style={{ color: '#fff' }}>
            <section className="section">
              <span>icon</span>
              <span className="text">123</span>
            </section>

            <section className="section active">
              <span>icon</span>
              <span className="text">123</span>
            </section>

            <section className="section">
              <span>icon</span>
              <span className="text">123</span>
            </section>
          </Sider>

          <Layout>
            <Content style={contentStyle}>789612321321312312</Content>
          </Layout>
        </Layout>
      </Sider>

      <Layout>
        <Content style={contentStyle}>
          <div>789</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ISlide;
