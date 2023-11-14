import { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (input.trim().length === 0) {
  //     window.location.reload();
  //     return;
  //   } else {
  //     try {
  //       const response = await axios.post("http://localhost:9000/validation", {
  //         inputData: input,
  //         type: "search",
  //       });
  //       console.log(response.status);
  //       if (response.status === 200) {
  //         window.location.replace(`/result/search/${input}`);
  //       }
  //     } catch (error) {
  //       {
  //         error &&
  //           console.error("Error sending POST request:", error.response.data);
  //       }
  //       setInput("");
  //       location.reload();
  //     }
  //   }
  // };
  const handleSubmit = () => {
    let result = containsXSS(input);
    console.log(result);
    if (result) {
      window.location.reload();
    } else {
      window.location.replace(`/result/search/${input}`);
    }
  };
  function containsXSS(input) {
    const xssPattern = /<script|alert\(|<\/script|javascript:/i;
    return xssPattern.test(input);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {/* <form onSubmit={handleSubmit}> */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <h2>Search:</h2>
        <input id="search-input" onChange={(e) => setInput(e.target.value)} />
        {/* <button id="search-button" type="submit">
            Search
          </button> */}
        <button id="search-button" onClick={handleSubmit}>
          Search
        </button>
      </div>
      {/* </form> */}
      <hr />
      <a href="/login">
        <button id="login-button">Login</button>
      </a>
    </div>
  );
}

export default App;
