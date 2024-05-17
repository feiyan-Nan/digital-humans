import useStore from '@/store';

function Home() {
  const count = useStore((state) => state.count);

  return (
    <div className="font-700 c-red">
      Home
      <p m-b-20>count : {count}</p>
    </div>
  );
}

export default Home;
