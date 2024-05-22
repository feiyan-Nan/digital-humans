import useStore from '@/store';

import Button from '@/components/button';

function Home() {
  const count = useStore((state) => state.count);

  return (
    <>
      <Button
        onClick={() => {
          console.log(123);
        }}
        value="abc"
      />
      <div className="font-700 c-red">
        Home
        <p m-b-20>count : {count}</p>
      </div>
    </>
  );
}

export default Home;
