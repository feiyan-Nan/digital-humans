import { useRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Input, InputRef } from 'antd';
import edit from '@/static/icons/edit.png';

interface InlineEditProps {
  name: string;
  onChange?: (value: string) => void;
  hideEdit?: boolean;
}

function InlineEdit({ name: originName, onChange, hideEdit = false }: InlineEditProps) {
  const [name, setName] = useState(originName);

  const [state, { toggle }] = useBoolean(false);

  const ref = useRef<InputRef>(null);

  const onChangeInput = (e: any) => {
    setName(e.target.value);
  };

  const onBlur = () => {
    if (name === '') {
      setName(originName);
    } else {
      originName !== name && onChange?.(name);
    }

    toggle();
  };

  const onPressEnter = () => ref.current?.blur();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {!state && (
        <div
          className="edit_name"
          onClick={() => {
            toggle();
            setTimeout(() => {
              ref.current && ref.current.focus();
            }, 10);
          }}
        >
          {name} {!hideEdit && <img src={edit} alt="" />}
        </div>
      )}
      <Input
        style={{ display: state ? 'block' : 'none' }}
        ref={ref}
        value={name}
        onBlur={onBlur}
        onChange={onChangeInput}
        onPressEnter={onPressEnter}
        placeholder="请输入名称"
      />
    </div>
  );
}

export default InlineEdit;
