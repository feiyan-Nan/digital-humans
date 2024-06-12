import React from 'react';
import { useAsyncEffect, useBoolean } from 'ahooks';
import { Input } from 'antd';

import whiteEditIcon from '@/static/icons/white_edit.png';
import deleteIcon from '@/static/icons/white_delete.png';

import './index.scss';

type IProps = {
  defaultValue: string | undefined;
  editable: boolean;
  onDelete?: () => void;
};

const EditInput: React.FC<IProps> = ({ defaultValue, editable, onDelete }) => {
  const [editStatus, { setTrue, setFalse }] = useBoolean(false);

  // useAsyncEffect(async () => {
  //   editable ? setTrue() : setFalse();
  //   console.log('AT-[ editable &&&&&********** ]', editable);
  // }, [editable]);

  const handleEdit = () => {
    console.log('AT-[ handleEdit &&&&&********** ]');
    setTrue();
  };

  return (
    defaultValue && (
      <div className="edit_input">
        {editStatus ? (
          <Input defaultValue={defaultValue} size="small" onPressEnter={setFalse} onBlur={setFalse} />
        ) : (
          <>
            <span className="edit_input_text">{defaultValue}</span>

            {editable && (
              <>
                <img src={whiteEditIcon} className="edit_input_edit_icon" alt="" onClick={handleEdit} />
                <img src={deleteIcon} className="edit_input_delete_icon" alt="" onClick={onDelete} />
              </>
            )}
          </>
        )}
      </div>
    )
  );
};

export default EditInput;
