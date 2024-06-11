import React, { useRef } from 'react';
import { useSetState, useAsyncEffect } from 'ahooks';
import './index.scss';
// import { Input } from 'antd';
// import type { InputRef } from 'antd';

type IProps = {
  text: string;
  defaultEditStatus?: boolean;
};

type IState = {
  defaultEditStatus: boolean;
};

const EditInput: React.FC<IProps> = ({ text, defaultEditStatus = false }) => {
  const inputRef = useRef<HTMLElement>(null);

  const [state, setState] = useSetState<IState>({ defaultEditStatus });

  useAsyncEffect(async () => {
    console.log('AT-[ in                &&&&&********** ]', defaultEditStatus);
    setState({ defaultEditStatus });
  }, [defaultEditStatus]);

  useAsyncEffect(async () => {
    state.defaultEditStatus && inputRef.current?.focus();
  }, [state.defaultEditStatus]);

  const handleBlur = () => {
    console.log('AT-[ handleBlur &&&&&********** ]');
    setState({ defaultEditStatus: false });
  };

  const handleFocus = () => {
    console.log('AT-[ handleFocus &&&&&********** ]');
    document.execCommand('selectAll', false, undefined);
    document.getSelection()?.collapseToEnd();
  };

  return (
    <span
      suppressContentEditableWarning
      contentEditable={state.defaultEditStatus}
      onBlur={handleBlur}
      onFocus={handleFocus}
      className="editdom"
      ref={inputRef}
    >
      {text}
    </span>
  );
};

export default EditInput;
