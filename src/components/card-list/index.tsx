import React from 'react';
import classNames from 'classnames';
import { useSetState, useAsyncEffect, useBoolean } from 'ahooks';
import { Input } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import whiteEditIcon from '@/static/icons/white_edit.png';
import deleteIcon from '@/static/icons/white_delete.png';

// import InlineEdit from '@/components/InlineEdit';
import './index.scss';
import InlineEdit from '@/components/InlineEdit';

type IProps = {
  items: IItem[];
  activeKey: number;
  edit?: boolean;
  onChange?: (checkedValue: IItem) => void;
  type?: 'avatar' | 'default';
};

type IItem = { url: string; name?: string; id: number; text?: string };

type IState = {
  items: IItem[];
  activeKey: number;
  editKey: number | undefined;
  type: 'avatar' | 'default';
};

const CardList: React.FC<IProps> = ({ items, activeKey = 0, edit = false, onChange, type = 'default' }) => {
  const [state, setState] = useSetState<IState>({ activeKey, items, type, editKey: undefined });

  useAsyncEffect(async () => {
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

  const [editState, { setTrue, setFalse }] = useBoolean(edit);

  // const onBlur = () => setFalse();

  const handleEdit = (editKey: number) => {
    setState({ editKey });
    setTrue();
  };

  const handleDelete = () => {
    console.log('AT-[ handleDelete &&&&&********** ]');
  };

  return (
    <div className="card_list">
      <div className="sub_nav_main_body">
        {state.items.map((item, index) => (
          <div className={classNames('sub_nav_main_item', index === state.activeKey ? 'active' : null)} key={item.id}>
            <LazyLoadImage width="80px" effect="blur" src={item.url} onClick={() => handleClick(index)} />
            {/* {item.text && <div className="name">{item.text}</div>} */}

            {editState && item.text && state.editKey === index ? (
              <Input defaultValue={item.text} size="small" onBlur={setFalse} />
            ) : (
              <div className="cardlist_name">
                <span className="cardlist_name_text">{item.text}</span>
                <img src={whiteEditIcon} className="cardlist_edit_icon" onClick={() => handleEdit(index)} alt="" />
                <img src={deleteIcon} alt="" className="cardlist_delete_icon" onClick={handleDelete} />
              </div>
            )}
          </div>
        ))}

        {/* <div style={{ width: '80px' }}>
          <div
            className={classNames('sub_nav_main_item', index === state.activeKey ? 'active' : null)}
            key={item.id}
            onClick={() => handleClick(index)}
          >
            <LazyLoadImage width="80px" effect="blur" src={item.url} />
          </div>
          {item.name && <InlineEdit hideEdit name={item.name} onChange={onNameChange} />}
        </div> */}
      </div>
    </div>
  );
};

export default CardList;
