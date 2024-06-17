import React, { FC } from 'react';

import classNames from 'classnames';
import { Modal, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import uploadIcon from '@/static/icons/uploadIcon.png';
import './index.scss';

interface IProps {
  text: string;
  onChange?: (formData: FormData, file: File) => void;
  accept: string;

  alert?: string;
}

const ButtonCom: FC<IProps> = ({ text, onChange, accept, alert }) => {
  const [open, { toggle, setTrue: showModal, setFalse: hideModal }] = useBoolean(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];

      const formData = new FormData();

      formData.append('file', selectedFile);

      onChange && onChange(formData, selectedFile);
    }
  };

  const onAlert = () => {
    showModal();
    // Modal.info({
    //   title: '',
    //   content: (
    //     <div>
    //       <p>{alert}</p>
    //     </div>
    //   ),
    //   onOk() {},
    // });
  };

  return (
    <>
      <Modal
        title={<InfoCircleOutlined style={{ color: '#7B68EE' }} />}
        open={open}
        onOk={hideModal}
        footer={
          <Button type="primary" onClick={hideModal} style={{ background: '#7B68EE' }}>
            ok
          </Button>
        }
      >
        <p>{alert}</p>
      </Modal>

      <div className={classNames('upload_button', alert ? 'alertable' : null)} onClick={alert ? onAlert : undefined}>
        <img src={uploadIcon} alt="" />
        {text}
        <input type="file" onChange={handleChange} accept={accept} />
      </div>
    </>
  );
};

export default ButtonCom;
