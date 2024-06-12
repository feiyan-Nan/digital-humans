import { useRef, useState } from 'react';
import { useToggle } from 'ahooks';
import { Input } from 'antd';
import edit from '@/static/icons/edit.png';

interface InlineEditProps {
  name: string;
  onChange?: (value: string) => void;
  hideEdit: boolean;
}

function InlineEdit({ name: originName, onChange, hideEdit = false }: InlineEditProps) {
  const [name, setName] = useState(originName);
  const [state, { toggle }] = useToggle(false);
  const ref = useRef(null);
  const onChangeInput = (e: any) => {
    setName(e.target.value);
  };
  const onBlur = () => {
    toggle(false);
    if (originName !== name) {
      onChange?.(name);
    }
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {!state && (
        <div
          className="edit_name"
          onClick={() => {
            console.log(ref.current);
            toggle(true);
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
        placeholder="Basic usage"
      />
    </div>
  );
}

export default InlineEdit;
