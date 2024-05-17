import useInputStore from '@/store/input';

const Card = () => {
  const inputValue = useInputStore((storeState) => storeState.inputValue);

  return (
    <div className="c-pink">
      Card
      <h3>inputValue: {inputValue}</h3>
    </div>
  );
};
export default Card;
