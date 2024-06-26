import React from 'react';
import classNames from 'classnames';
import { useAsyncEffect, useSetState } from 'ahooks';

import './index.scss';

type IProps = {
  items: string[];
  textMode?: 'white' | 'black';
  activeKey?: number;
  onTabChange?: (activeKey: number) => void;
  hideStatus?: boolean;
  style?: React.CSSProperties;
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
const AutoTabs: React.FC<IProps> = ({
  items,
  activeKey = 0,
  textMode = 'white',
  onTabChange,
  hideStatus = false,
  style,
}) => {
  const isSingle = items.length === 1;

  const [state, setState] = useSetState<IState>({
    activeKey,
    activeLineStyle: {
      width: isSingle ? '50%' : `${(1 / items.length) * 100}%`,
      marginLeft: isSingle ? 0 : `${(1 / items.length) * 100 * activeKey}%`,
    },
  });

  const activeClassName = `${textMode}_active`;

  const handleClick = (activeKey: number) => {
    if (state.activeKey !== activeKey) {
      const marginLeft = isSingle ? 0 : `${(1 / items.length) * 100 * activeKey}%`;

      setState({
        activeKey,
        activeLineStyle: { marginLeft },
      });

      onTabChange && onTabChange(activeKey);
    }
  };

  useAsyncEffect(async () => {
    // setState({ activeKey });
    handleClick(activeKey);
  }, [activeKey]);

  return (
    <div className="auto_tabs" style={style}>
      <div className="auto_tabs_items">
        {items.map((item, index) => (
          <div
            className={classNames(
              'auto_tabs_item',
              state.activeKey === index && activeClassName,
              items.length === 1 && 'alignLeft',
            )}
            key={item}
            onClick={() => handleClick(index)}
          >
            {item}
          </div>
        ))}
      </div>

      <div className={classNames('auto_tabs_line', activeClassName)}>
        {items.length > 1 ? <div className="auto_tabs_active_line" style={state.activeLineStyle} /> : null}
      </div>
    </div>
  );
};
export default AutoTabs;
