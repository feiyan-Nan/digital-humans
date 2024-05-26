import React, { FC, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useSetState } from 'ahooks';

import './index.scss';

interface IProps {
  items: string[];
  activeNum?: number;
  onChange?: (num: number) => void;
  mode?: 'light' | 'night';
  travel?: boolean;
}

const AutoTabs: FC<IProps> = ({ items, activeNum = 0, onChange, mode = 'light', travel = false }) => {
  const [state, setState] = useSetState<{
    activeNum: number;
    width: string;
    marginLeft: string;
    modeActiveName: string;
    lineBackground: string;
  }>({
    activeNum,
    width: `${(1 / items.length) * 100}%`,
    marginLeft: '0',
    modeActiveName: `${mode}_active`,
    lineBackground: `${mode}_sub_nav_line`,
  });

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log('auto tabs activeNum change', activeNum);
  //   });
  // }, [activeNum]);

  const handleClick = useCallback(
    (num: number) => {
      setState({ activeNum: num });
    },
    [setState],
  );

  useEffect(() => {
    setState({ marginLeft: `${(1 / items.length) * 100 * state.activeNum}%` });
  }, [state.activeNum, setState, items]);

  useEffect(() => {
    console.log('state.activeNum auto-tabs组件', state.activeNum);

    if (onChange) {
      onChange(state.activeNum);
    }
  }, [state.activeNum, onChange]);

  // useEffect(() => {
  //   // if (onChange) {
  //   //   onChange(activeNum);
  //   // }

  //   handleClick(activeNum);
  // }, [activeNum, handleClick]);

  const css: React.CSSProperties = {
    justifyContent: 'flex-start',
    color: '#fff',
    cursor: 'default',
  };

  return (
    <>
      <div className="sub_nav_header">
        {items.map((item, index) => (
          <div
            className={classNames(
              'sub_nav_header_item',
              state.activeNum === index && !travel ? state.modeActiveName : null,
            )}
            style={{ width: state.width, cursor: item === '' ? 'default' : 'pointer', ...(travel ? css : null) }}
            key={item}
            onClick={() => item !== '' && handleClick(index)}
          >
            {item}
          </div>
        ))}
      </div>

      <div className={classNames('sub_nav_line', state.lineBackground)}>
        <div
          className="sub_nav_line_light"
          style={{ marginLeft: state.marginLeft, width: !travel ? state.width : 0 }}
        />
      </div>
    </>
  );
};

export default AutoTabs;
