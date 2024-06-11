// import { Upload } from 'antd';
import React, { FC } from 'react';
import uploadIcon from '@/static/icons/uploadIcon.png';
import './index.scss';

interface IProps {
  text: string;
  onChange?: (formData: FormData, file: File) => void;
  accept: string;
}

const ButtonCom: FC<IProps> = ({ text, onChange, accept }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('AT-[ handleChange &&&&&********** 点击一次 ]');
    if (e.target.files) {
      const selectedFile = e.target.files[0];

      const formData = new FormData();

      formData.append('file', selectedFile);

      onChange && onChange(formData, selectedFile);
    }
  };

  return (
    <div className="upload_button">
      <img src={uploadIcon} alt="" />
      {text}
      <input type="file" onChange={handleChange} accept={accept} />
    </div>
  );
};

export default ButtonCom;
