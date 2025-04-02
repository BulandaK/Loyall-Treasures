"use client";

import React, { useEffect, useState } from "react";

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
  role: Role;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Users List</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Username
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.user_id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-blue-100 transition-colors`}
              >
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.user_id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.username}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.first_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.last_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.role.role_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
