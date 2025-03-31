import React from "react";
import { AiOutlineGoogle } from "react-icons/ai"; // Import ikony Google
import "./signup.css";

export default function SignupPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Create Account</h2>
      <form className="w-full max-w-md space-y-4">
        <div className="flex space-x-4">
          <input type="text" placeholder="First Name" className="input-field" />
          <input type="text" placeholder="Last Name" className="input-field" />
        </div>
        <input type="email" placeholder="Email" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Create Account
        </button>
      </form>
      <div className="flex space-x-4 mt-6">
        <button className="social-button bg-red-500 text-white flex items-center justify-center space-x-2">
          <AiOutlineGoogle size={20} /> {/* Ikona Google */}
          <span>Sign up with Google</span>
        </button>
      </div>
    </div>
  );
}
