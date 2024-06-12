import React, { ChangeEvent } from 'react';
import classNames from 'classnames';
import { useSetState, useAsyncEffect } from 'ahooks';
import { Input } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import whiteEditIcon from '@/static/icons/white_edit.png';
import deleteIcon from '@/static/icons/white_delete.png';

import EditInput from './components/edit-com';

// import InlineEdit from '@/components/InlineEdit';
import './index.scss';

// import InlineEdit from '@/components/InlineEdit';

type IProps = {
  items: IItem[];
  activeKey: number;
  editable?: boolean;
  onChange?: (checkedValue: IItem) => void;
  type?: 'avatar' | 'default';
};

type IItem = { url: string; name?: string; id: number; text?: string };

type IState = {
  items: IItem[];
  activeKey: number;
  editKey: number | undefined;
  type: 'avatar' | 'default';
  editable: boolean;
};

const CardList: React.FC<IProps> = ({ items, activeKey = 0, editable = false, onChange, type = 'default' }) => {
  const [state, setState] = useSetState<IState>({ activeKey, items, type, editKey: undefined, editable });

  useAsyncEffect(async () => {
    setState({ items });
  }, [items]);

  useAsyncEffect(async () => {
    setState({ editable });
  }, [editable]);

  const handleClick = (activeKey: number) => {
    if (activeKey !== state.activeKey) {
      setState({ activeKey });
      onChange && onChange(items[activeKey]);
    }
  };
  const onNameChange = (name: string) => {
    console.log(name);
  };

  // const [editState, { setTrue, setFalse }] = useBoolean(state.editable);

  // const onBlur = () => setFalse();

  const onPressEnter = (editKey: number) => {
    console.log('AT-[ editKey &&&&&********** ]', editKey);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('AT-[ e &&&&&********** ]', e.target?.value);
  };

  const handleEdit = (editKey: number) => {
    setState({ editKey });
  };

  const handleDelete = (index: number) => {
    console.log('AT-[ handleDelete &&&&&********** ]', index);
  };

  return (
    <div className="card_list">
      <div className="sub_nav_main_body">
        {state.items.map((item, index) => (
          <div className={classNames('sub_nav_main_item', index === state.activeKey ? 'active' : null)} key={item.id}>
            <LazyLoadImage width="100%" effect="blur" src={item.url} onClick={() => handleClick(index)} />

            <EditInput defaultValue={item.text} editable={state.editable} onDelete={() => handleDelete(index)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardList;
