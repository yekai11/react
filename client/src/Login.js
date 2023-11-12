import React from "react";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.trim().length === 0) {
      window.location.reload();
      return;
    } else {
      try {
        const response = await axios.post("http://localhost:9000/validation", {
          inputData: password,
          type: "password",
        });
        console.log(response.status);
        if (response.status === 200) {
          window.location.replace(`/result/password/${password}`);
        }
      } catch (error) {
        console.error("Error sending POST request:", error.response.data);
        setPassword("");
        location.reload();
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Password:</h2>
          <input minLength={10} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </div>
      </form>
      <hr />

      <a href="/">
        <button>Home</button>
      </a>
    </div>
  );
};

export default Login;
