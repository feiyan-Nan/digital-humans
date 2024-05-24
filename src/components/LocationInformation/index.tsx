import React from 'react';
import { Button, Space } from 'antd';
import { shallow } from 'zustand/shallow';
import useStore from '@/store';

function LocationInformation() {
  const { scale, locations, updateDigitalImage, updateBackGroundImage } = useStore(
    (state) => ({
      scale: state.scale,
      locations: state.locations,
      updateDigitalImage: state.updateDigitalImage,
      updateBackGroundImage: state.updateBackGroundImage,
    }),
    shallow,
  );

  const digitalImage = [
    'https://digital-person.oss-cn-hangzhou.aliyuncs.com/alpha/51c8b926-62b5-4a2e-944e-ea54499eb5e6_avatar.png',
    'https://digital-person.oss-cn-hangzhou.aliyuncs.com/alpha/2d420910-2a01-48fd-b669-ce6ee47a87c4_avatar.png',
  ];

  return (
    <>
      <Space style={{ marginLeft: '100px' }}>
        <span>位置信息</span>
        <span>X:{Math.round(locations.left / scale)}</span>
        <span>Y:{Math.round(locations.top / scale)}</span>
      </Space>
      <Space style={{ marginLeft: '50px' }}>
        <span>大小信息</span>
        <span>W:{Math.round(locations.width / scale)}</span>
        <span>H:{Math.round(locations.height / scale)}</span>
      </Space>
      <Space style={{ marginLeft: '100px' }}>
        Tips: 随机的,多点几次
        <Button
          onClick={() => updateDigitalImage(digitalImage[Math.floor(Math.random() * digitalImage.length)])}
          type="primary"
        >
          更改数字人
        </Button>
      </Space>
      <Space style={{ marginLeft: '100px' }}>
        <Button onClick={() => updateBackGroundImage('')} type="primary">
          清空背景图
        </Button>
      </Space>
    </>
  );
}

export default LocationInformation;
