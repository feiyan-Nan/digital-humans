import React from 'react';
import classNames from 'classnames';

// import img from '@/static/imgs/test.png';
import './index.scss';

type IProps = {
  items: { img: string; text?: string }[];
  activeNum: number;
};

const CardList: React.FC<IProps> = ({ items, activeNum = 0 }) => (
  <div className="sub_nav_main">
    <div className="sub_nav_main_body">
      {items.map((item, index) => (
        <div
          className={classNames('sub_nav_main_item', index === activeNum ? 'active' : null)}
          key={item.img + Math.random()}
        >
          <img src={item.img} alt="" />
          {item.text && <div className="name">{item.text}</div>}
        </div>
      ))}
    </div>
  </div>
);

export default CardList;
