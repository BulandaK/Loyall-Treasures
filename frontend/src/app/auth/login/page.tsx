"use client";
import React, { useState } from "react";
import { AiOutlineGoogle } from "react-icons/ai"; // Import ikony Google
import { useAuth } from "@/context/AuthContext";
import "./login.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Dodajemy stan dla sukcesu
  const { login } = useAuth();

  // Obsługa zmiany w polach formularza
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Obsługa wysyłania formularza
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      setMessage("Login successful!");
      setIsSuccess(true); // Ustawiamy sukces na true
      setFormData({ email: "", password: "" });
    } catch (error) {
      setMessage("Login failed. Please check your credentials.");
      console.error("Login error:", error);
      setIsSuccess(false); // Ustawiamy sukces na false
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Login</h2>
      <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input-field"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center ${
            isSuccess ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
      <div className="flex space-x-4 mt-6">
        <button className="social-button bg-red-500 text-white flex items-center justify-center space-x-2">
          <AiOutlineGoogle size={20} /> {/* Ikona Google */}
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
}
