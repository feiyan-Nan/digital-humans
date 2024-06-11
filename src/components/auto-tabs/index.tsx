import React from 'react';
import classNames from 'classnames';
import { useSetState } from 'ahooks';

import './index.scss';

type IProps = {
  items: string[];
  textMode?: 'white' | 'black';
  activeKey?: number;
  onTabChange?: (activeKey: number) => void;
};

type IState = {
  activeKey: number;
  activeLineStyle: React.CSSProperties;
};

/**
 * @param   type
 * default  默认模式
 * line     单个模式
 *
 * @param   textMode
 * white  白字模式
 * black  黑子模式
 *
 *@param  activeKey
 默认激活的key

 * @returns
 */
const AutoTabs: React.FC<IProps> = ({ items, activeKey = 0, textMode = 'white', onTabChange }) => {
  const isSingle = items.length === 1;

  const [state, setState] = useSetState<IState>({
    activeKey,
    activeLineStyle: { width: isSingle ? '50%' : `${(1 / items.length) * 100}%` },
  });

  const activeClassName = `${textMode}_active`;

  const handleClick = (activeKey: number) => {
    if (state.activeKey !== activeKey) {
      const marginLeft = isSingle ? '50%' : `${(1 / items.length) * 100 * activeKey}%`;

      setState({
        activeKey,
        activeLineStyle: { marginLeft },
      });

      onTabChange && onTabChange(activeKey);
    }
  };

  return (
    <div className="auto_tabs">
      <div className="auto_tabs_items">
        {items.map((item, index) => (
          <div
            className={classNames('auto_tabs_item', state.activeKey === index && activeClassName)}
            key={item}
            onClick={() => handleClick(index)}
          >
            {item}
          </div>
        ))}
      </div>

      <div className={classNames('auto_tabs_line', activeClassName)}>
        <div className="auto_tabs_active_line" style={state.activeLineStyle} />
      </div>
    </div>
  );
};
export default AutoTabs;
