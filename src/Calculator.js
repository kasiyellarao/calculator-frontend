// src/Calculator.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { evaluate } from "mathjs";

function Calculator() {
  const [input, setInput] = useState("");

  // Render-hosted backend API
  const BACKEND_URL =
    "https://calculator-backend-jwnp.onrender.com/";

  // Change browser tab title
  useEffect(() => {
    document.title = "Full Stack Calculator";
  }, []);

  const handleClick = (value) => {
    if (!"0123456789+-*/.".includes(value)) return;
    setInput((prev) => prev + value);
  };

  const calculate = async () => {
    try {
      if (!input.trim()) {
        alert("Please enter an expression");
        return;
      }

      // Sanitize input
      const sanitizedInput = input.replace(/[^0-9+\-*/.]/g, "");

      if (!sanitizedInput) {
        alert("Invalid Expression");
        return;
      }

      // Safe calculation instead of eval()
      const result = evaluate(sanitizedInput);

      // Save to backend
      try {
        await axios.post(
          BACKEND_URL,
          {
            expression: sanitizedInput,
            result: result,
          },
          {
            timeout: 15000,
          }
        );
      } catch (err) {
        console.error("Backend error:", err);
      }

      setInput(result.toString());
    } catch (error) {
      console.error("Calculation error:", error);
      alert("Invalid Expression");
    }
  };

  const clearInput = () => {
    setInput("");
  };

  return (
    <div className="calculator">
      <h2>Full Stack Calculator</h2>

      <input type="text" value={input} readOnly />

      <div className="buttons">
        {"1234567890+-*/.".split("").map((btn) => (
          <button key={btn} onClick={() => handleClick(btn)}>
            {btn}
          </button>
        ))}

        <button onClick={calculate}>=</button>
        <button onClick={clearInput}>C</button>
      </div>
    </div>
  );
}

export default Calculator;
