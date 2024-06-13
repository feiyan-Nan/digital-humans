import React from 'react';
import UploadButton from '@/components/upload-button';

import './index.scss';

type IProps = {
  tip: string | React.ReactNode;
  btnText: string;
  accept?: string;
  onChange?: (formData: FormData, file: File) => void;
  black?: boolean;
  style?: React.CSSProperties;
  alert?: string;
};

const TipAndUpload: React.FC<IProps> = ({
  tip,
  btnText,
  accept = 'audio/*',
  onChange,
  black = false,
  style,
  alert,
}) => {
  const handleChange = (formData: FormData, file: File) => onChange && onChange(formData, file);

  const tipStyle: React.CSSProperties = {
    color: black ? '#545454' : 'rgba(185, 190, 199, .6)',
    ...style,
  };

  return (
    <div className="tipandupload">
      <div className="tipandupload_tips" style={tipStyle}>
        {tip}
      </div>

      <UploadButton text={btnText} accept={accept} onChange={handleChange} alert={alert} />
    </div>
  );
};

export default TipAndUpload;
