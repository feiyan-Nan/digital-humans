// import { Button } from 'antd';
import { FC } from 'react';

interface IProps {
  items: string[];
  activeNum: 0;
}

const ButtonCom: FC<IProps> = ({ items, activeNum }) => {
  console.log(888);

  return (
    <>
      <div className="sub_nav_header">
        {/* <div className="sub_nav_header_item active">默认背景</div>
    <div className="sub_nav_header_item">自定义</div> */}
        {items.map((item, index) => {
          const active = activeNum === index ? 'active' : null;

          return (
            <div className={`sub_nav_header_item ${active}`} key={item}>
              {item}
            </div>
          );
        })}
      </div>

      <div className="sub_nav_line">
        <div className="sub_nav_line_light" />
      </div>
    </>
  );
};

export default ButtonCom;
