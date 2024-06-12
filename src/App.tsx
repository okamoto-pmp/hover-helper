import "./App.css";

function App() {
  const handleEnqueue = () => {
    chrome.runtime.sendMessage({
      action: "enqueue",
    });
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button
        onClick={handleEnqueue}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Enqueue
      </button>
    </>
  );
}

export default App;
