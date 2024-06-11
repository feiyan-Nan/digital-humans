// import { Upload } from 'antd';
import React, { FC } from 'react';
import uploadIcon from '@/static/icons/uploadIcon.png';
import './index.scss';

interface IProps {
  text: string;
  onChange?: (formData: FormData) => void;
  accept: string;
}

const ButtonCom: FC<IProps> = ({ text, onChange, accept }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];

      const formData = new FormData();

      formData.append('file', selectedFile);

      onChange && onChange(formData);
    }
  };

  return (
    <div className="sub_nav_btn">
      <img src={uploadIcon} alt="" />
      {text}
      <input type="file" onChange={handleChange} accept={accept} />
    </div>
  );
};

export default ButtonCom;
