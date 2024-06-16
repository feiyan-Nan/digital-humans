import React from 'react';
import classNames from 'classnames';
import { useSetState, useAsyncEffect } from 'ahooks';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import EditCom from './components/edit-com';
import cantIcon from '@/static/icons/cant.png';

import './index.scss';

type IItem = {
  url: string;
  name?: string;
  id: number;
  text?: string;
  mask?: string;
  enable: boolean;
  audioName: string;
} | null;

type IProps = {
  items: IItem[];
  activeKey?: number;
  editable?: boolean;
  onChange?: (checkedValue: IItem) => void;
  type?: 'avatar' | 'default';
  onDelete?: (item: any) => void;
  onEdit?: (item: any) => void;
};

type IState = {
  items: IItem[];
  activeKey?: number;
  editKey: number | undefined;
  type: 'avatar' | 'default';
  editable: boolean;
};

const CardList: React.FC<IProps> = ({
  items,
  activeKey = -1,
  editable = false,
  onChange,
  type = 'default',
  onDelete,
  onEdit,
}) => {
  const [state, setState] = useSetState<IState>({ activeKey, items, type, editKey: undefined, editable });

  useAsyncEffect(async () => setState({ items }), [items]);

  useAsyncEffect(async () => setState({ activeKey }), [activeKey]);

  useAsyncEffect(async () => setState({ editable }), [editable]);

  const handleClick = (activeKey: number) => {
    if (activeKey !== state.activeKey) {
      setState({ activeKey });
      onChange && onChange(items[activeKey]);
    }
  };

  return (
    <div className="card_list">
      <div className="sub_nav_main_body">
        {type === 'default'
          ? state.items.map((item, index) => (
              <div
                className={classNames('sub_nav_main_item', index === state.activeKey ? 'active' : null)}
                key={item ? item?.id : 'mmm'}
              >
                {item === null ? (
                  <div
                    className={classNames('empty_site', index === state.activeKey ? 'active' : null)}
                    onClick={() => handleClick(index)}
                  >
                    <img src={cantIcon} alt="" />
                  </div>
                ) : (
                  <>
                    <LazyLoadImage
                      width="100%"
                      effect="blur"
                      src={item.url}
                      onClick={() => !item.mask && handleClick(index)}
                      wrapperClassName="face"
                      // wrapperClassName={item.mask ? 'mask face' : 'face'}
                      // wrapperProps={{
                      //   placeholder: item.mask,
                      // }}
                    />

                    <EditCom
                      defaultValue={item.text}
                      editable={state.editable && item.enable}
                      deleteAble={state.editable}
                      onDelete={() => onDelete && onDelete(item)}
                      onEdit={(newValue: string) => onEdit?.({ ...item, newValue })}
                    />
                  </>
                )}
              </div>
            ))
          : state.items.map((item, index) =>
              item ? (
                <div
                  className={classNames('avatar_type', index === state.activeKey ? 'active' : null)}
                  key={item.id}
                  onClick={() => handleClick(index)}
                >
                  <div className="avatar">
                    <LazyLoadImage width="100%" effect="blur" src={item.url} />
                  </div>

                  <div className="name_text">{item.audioName}</div>
                </div>
              ) : null,
            )}
      </div>
    </div>
  );
};

export default CardList;
