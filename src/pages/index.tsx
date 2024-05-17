import { css, cx } from '@emotion/css';
import { Outlet, useNavigate } from 'react-router-dom';
import { Input, Switch } from 'antd';
import { useToggle } from 'ahooks';
import { shallow } from 'zustand/shallow';
import { useEffect } from 'react';
import Button from '@/components/button';
import useStore from '@/store';

const cardStyle = css`
  border: 1px solid blue;
`;

function Index() {
  const [state, { toggle }] = useToggle(false);

  const { decrement, increment, setInputValue } = useStore(
    (storeState) => ({
      increment: storeState.increment,
      decrement: storeState.decrement,
      setInputValue: storeState.setInputValue,
    }),
    shallow,
  );

  const navigate = useNavigate();

  return (
    <>
      <div border="4 solid blue" w-100 m="a t-10 b-20">
        <p>Vite + React</p>
        <Switch checked={state} onChange={toggle} m-b-4 />
      </div>

      <div m-b-20 className={cx('card', cardStyle)}>
        <Button
          value="increment count"
          onClick={() => {
            increment();
          }}
        />

        <Button
          value="decrement count"
          onClick={() => {
            decrement();
          }}
        />
        <p>
          <Input
            onPressEnter={(event) => {
              setInputValue((event.target as HTMLInputElement)?.value as string);
            }}
          />
        </p>
      </div>

      <div border="1 blue solid" p="4" flex="~ content-center justify-center" m="a">
        <Button
          value="Home"
          onClick={() => {
            navigate('/home');
          }}
        />

        <Button
          value="Card"
          onClick={() => {
            navigate('/card');
          }}
        />
      </div>
      <Outlet />
    </>
  );
}

export default Index;
