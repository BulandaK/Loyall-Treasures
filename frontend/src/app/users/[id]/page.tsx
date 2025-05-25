"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Role {
  role_id: number;
  role_name: string;
  description: string;
}

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  created_at: string;
  last_login: string | null;
  is_active: boolean;
  role: Role;
}
const UserPage = () => {
  const params = useParams();
  const id = params?.id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-lg font-semibold text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        User not found
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sekcja profilu */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3 border border-green-500">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-green-200 rounded-full mb-4"></div>
            <h2 className="text-xl font-bold text-black">{`${user.first_name} ${user.last_name}`}</h2>
            <p className="text-black">{user.email}</p>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-black">
              Preferences
            </h3>
            <ul className="list-disc list-inside text-black">
              <li>Receive email notifications</li>
              <li>Receive SMS alerts</li>
            </ul>
          </div>
        </div>

        {/* Sekcja zniżek */}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-4 text-black">
            Role Information
          </h3>
          <div className="bg-white shadow-md rounded-lg p-4 border border-green-500">
            <h4 className="text-lg font-semibold text-black">
              {user.role.role_name}
            </h4>
            <p className="text-black text-sm">{user.role.description}</p>
          </div>
        </div>
      </div>

      {/* Sekcja stopki */}
      <footer className="mt-10 bg-green-100 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-black text-sm text-center md:text-left">
            Loyall is your go-to platform for the latest deals on a wide range
            of products.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-black hover:text-green-700">
              Facebook
            </a>
            <a href="#" className="text-black hover:text-green-700">
              Twitter
            </a>
            <a href="#" className="text-black hover:text-green-700">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserPage;
