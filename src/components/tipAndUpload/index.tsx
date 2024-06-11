import React from 'react';
import UploadButton from '@/components/upload-button';

import './index.scss';

type IProps = {
  tip: string | React.ReactNode;
  btnText: string;
  accept: string;
  onChange?: (formData: FormData, file: File) => void;
};

const TipAndUpload: React.FC<IProps> = ({ tip, btnText, accept, onChange }) => {
  const handleChange = (formData: FormData, file: File) => onChange && onChange(formData, file);

  return (
    <div className="tipandupload">
      <div className="tipandupload_tips">{tip}</div>
      <UploadButton text={btnText} accept={accept} onChange={handleChange} />
    </div>
  );
};

export default TipAndUpload;
