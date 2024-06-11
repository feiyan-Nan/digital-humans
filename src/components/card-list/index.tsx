import React from 'react';
import classNames from 'classnames';
import { useSetState, useAsyncEffect } from 'ahooks';

import './index.scss';

type IProps = {
  items: IItem[];
  activeKey: number;
  edit?: boolean;
  onChange?: (checkedValue: IItem) => void;
};

type IItem = { url: string; text?: string; id: number };

type IState = {
  items: IItem;
};

const CardList: React.FC<IProps> = ({ items, activeKey = 0, edit = false, onChange }) => {
  const [state, setState] = useSetState({ activeKey, items });

  useAsyncEffect(async () => {
    console.log('更新了.....', items);
    setState({ items });
  }, [items]);

  const handleClick = (activeKey: number) => {
    if (activeKey !== state.activeKey) {
      setState({ activeKey });
      onChange && onChange(items[activeKey]);
    }
  };

  return (
    <div className="sub_nav_main">
      <div className="sub_nav_main_body">
        {state.items.map((item, index) => (
          <div
            className={classNames('sub_nav_main_item', index === state.activeKey ? 'active' : null)}
            key={item.id}
            onClick={() => handleClick(index)}
          >
            <img src={item.url} alt="" />
            {item.text && <div className="name">{item.text}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardList;
