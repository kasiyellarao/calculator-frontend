// src/Calculator.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function Calculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  // Render-hosted backend API
  const BACKEND_URL = "https://calculator-backend-jwnp.onrender.com/api/calculations";

  // Change browser tab title
  useEffect(() => {
    document.title = "Full Stack Calculator";
  }, []);

  const handleClick = (value) => {
    if (!"0123456789+-*/.".includes(value)) return;
    setInput(prev => prev + value);
  };

  const calculate = async () => {
    try {
      if (!input) throw new Error("Empty input");

      // Sanitize input
      const sanitizedInput = input.replace(/[^0-9+\-*/.]/g, "");

      // Evaluate expression
      const result = eval(sanitizedInput);

      // Save to backend (do not block calculation on failure)
      try {
        await axios.post(
          BACKEND_URL,
          { expression: sanitizedInput, result },
          { timeout: 15000 } // wait up to 15s
        );
      } catch (err) {
        console.error("Backend error:", err);
      }

      setInput(result.toString());
      // fetchHistory(); // uncomment if you want history auto-refresh

    } catch {
      alert("Invalid Expression");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(BACKEND_URL);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  // useEffect(() => {
  //   fetchHistory();
  // }, []);

  return (
    <div className="calculator">
      <h2>Full Stack Calculator</h2>

      <input value={input} readOnly />

      <div className="buttons">
        {"1234567890+-*/".split("").map(btn => (
          <button key={btn} onClick={() => handleClick(btn)}>
            {btn}
          </button>
        ))}
        <button onClick={calculate}>=</button>
        <button onClick={() => setInput("")}>C</button>
      </div>


    </div>
  );
}

export default Calculator;
