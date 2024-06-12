import React from 'react';
import classNames from 'classnames';
import { useSetState, useAsyncEffect } from 'ahooks';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './index.scss';
import InlineEdit from '@/components/InlineEdit';

type IProps = {
  items: IItem[];
  activeKey: number;
  edit?: boolean;
  onChange?: (checkedValue: IItem) => void;
};

type IItem = { url: string; name?: string; id: number };

type IState = {
  items: IItem[];
  activeKey: number;
};

const CardList: React.FC<IProps> = ({ items, activeKey = 0, edit = false, onChange }) => {
  const [state, setState] = useSetState<IState>({ activeKey, items });

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
  const onNameChange = (name: string) => {
    console.log(name);
  };

  return (
    <div className="card_list">
      <div className="sub_nav_main_body">
        {state.items.map((item, index) => (
          <div style={{ width: '80px' }}>
            <div
              className={classNames('sub_nav_main_item', index === state.activeKey ? 'active' : null)}
              key={item.id}
              onClick={() => handleClick(index)}
            >
              <LazyLoadImage width="80px" effect="blur" src={item.url} />
            </div>
            {item.name && <InlineEdit hideEdit name={item.name} onChange={onNameChange} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardList;
