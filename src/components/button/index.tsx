import { Button } from 'antd';
import { FC } from 'react';

interface IProps {
  value: string;
  onClick: () => void;
}

const ButtonCom: FC<IProps> = ({ value, onClick }) => (
  <Button p-x-4px p-y-2px b-rounded-1 m-r-6px cursor-pointer hover:p-x-8px hover:p-y-4px onClick={onClick}>
    {value}
  </Button>
);

export default ButtonCom;
