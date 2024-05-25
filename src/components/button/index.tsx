// import { Button } from 'antd';
import { FC } from 'react';
import uploadIcon from '@/static/icons/uploadIcon.png';
import './index.scss';

interface IProps {
  text: string;
  onClick?: () => void;
}

const ButtonCom: FC<IProps> = ({ text, onClick }) => (
  <div className="sub_nav_btn" onClick={onClick}>
    <img src={uploadIcon} alt="" />
    {text}
  </div>
);

export default ButtonCom;
