"use client";
import React, { useState } from "react";
import { AiOutlineGoogle } from "react-icons/ai"; // Import ikony Google
import "./signup.css";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Dodajemy stan dla sukcesu

  // Obsługa zmiany w polach formularza
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Obsługa wysyłania formularza
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}`,
          email: formData.email,
          password_hash: formData.password, // Zakładamy, że backend obsługuje hashowanie
          first_name: formData.firstName,
          last_name: formData.lastName,
          role_id: 2, // Domyślna rola użytkownika
        }),
      });

      if (response.ok) {
        setMessage("Account created successfully!");
        setIsSuccess(true); // Ustawiamy sukces na true
        setFormData({ firstName: "", lastName: "", email: "", password: "" });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
        setIsSuccess(false); // Ustawiamy sukces na false
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage("An error occurred while creating the account.");
      setIsSuccess(false); // Ustawiamy sukces na false
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Create Account</h2>
      <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="input-field"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="input-field"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
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
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Create Account
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
          <span>Sign up with Google</span>
        </button>
      </div>
    </div>
  );
}
