import React, { type ChangeEvent, KeyboardEvent } from 'react';
import { useBoolean } from 'ahooks';
import { Input, message } from 'antd';

import whiteEditIcon from '@/static/icons/white_edit.png';
import deleteIcon from '@/static/icons/white_delete.png';

import './index.scss';

type IProps = {
  defaultValue: string | undefined;
  editable: boolean;
  deleteAble: boolean;
  onDelete?: () => void;
  onEdit?: (newValue: string) => void;
};

const EditInput: React.FC<IProps> = ({ defaultValue, editable, deleteAble, onDelete, onEdit }) => {
  const [editStatus, { setTrue, setFalse }] = useBoolean(false);

  // const handleEdit = () => {
  //   console.log('AT-[ handleEdit &&&&&********** ]');
  //   setTrue();
  // };

  const onPressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log('e.target.value', e.currentTarget.value);

    const newValue = e.currentTarget.value;

    if (!newValue) {
      message.error('名称不能为空');
    } else {
      onEdit && onEdit(newValue);
      setFalse();
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('AT-[ e &&&&&********** ]', e.target.value);
  };

  const onBlur = () => {
    console.log('onBlur');
  };

  return (
    defaultValue && (
      <div className="edit_input">
        {editStatus ? (
          <Input
            defaultValue={defaultValue}
            size="small"
            onChange={onChange}
            onPressEnter={onPressEnter}
            onBlur={onBlur}
            maxLength={4}
          />
        ) : (
          <>
            <span className="edit_input_text">{defaultValue}</span>

            {editable && <img src={whiteEditIcon} className="edit_input_edit_icon" alt="" onClick={setTrue} />}

            {deleteAble && <img src={deleteIcon} className="edit_input_delete_icon" alt="" onClick={onDelete} />}
          </>
        )}
      </div>
    )
  );
};

export default EditInput;
