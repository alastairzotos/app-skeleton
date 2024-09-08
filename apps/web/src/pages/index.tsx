export default function Home() {
  const getThing = () => {
    fetch('http://localhost:3001/api/v1/auth-test').then(res => res.text()).then(console.log);
  }

  return (
    <>
      <p>hello</p>
      <button onClick={getThing}>
        get the thing
      </button>
    </>
  );
}
