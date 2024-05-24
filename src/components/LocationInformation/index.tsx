import React from 'react';
import { Space } from 'antd';
import { shallow } from 'zustand/shallow';
import useStore from '@/store';

function LocationInformation() {
  const { scale, locations } = useStore(
    (state) => ({
      scale: state.scale,
      locations: state.locations,
    }),
    shallow,
  );

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
    </>
  );
}

export default LocationInformation;
