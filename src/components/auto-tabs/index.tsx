import React from 'react';

type IProps = {
  items: string[];
  defaultNum: number;
};

const Tabs: React.FC<IProps> = ({ items, defaultNum }) => (
  <>
    <div className="sub_nav_header">
      {items.map((item, index) => (
        <div className={`sub_nav_header_item ${index === defaultNum ? 'active' : ''}`} key={Math.random()}>
          {item}
        </div>
      ))}
    </div>

    <div className="sub_nav_line">
      <div className="sub_nav_line_light" />
    </div>
  </>
);

export default Tabs;
