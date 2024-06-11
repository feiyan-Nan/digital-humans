import React from 'react';
import { Select, Space } from 'antd';
import { shallow } from 'zustand/shallow';
import useStore from '@/store';

function AspectRatio() {
  const { align, updateAlign } = useStore(
    (state) => ({
      align: state.align,
      updateAlign: state.updateAlign,
    }),
    shallow,
  );
  const onChange = (value: string) => {
    updateAlign(value);
  };
  return (
    <Space>
      画面比例
      <Select
        onChange={onChange}
        value={align}
        style={{ width: 100 }}
        options={[
          { value: 'VERTICAL', label: '9:16' },
          // { value: 'HORIZONTAL', label: '16:9' },
        ]}
      />
    </Space>
  );
}

export default AspectRatio;
