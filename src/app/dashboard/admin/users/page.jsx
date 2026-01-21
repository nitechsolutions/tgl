"use client";

import { useEffect, useState } from "react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch("/api/users");
      if (res.ok) setUsers(await res.json());
    }
    loadUsers();
  }, []);

  async function updateRole(id, role) {
    await fetch(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
    location.reload();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Users</h1>

      <table className="w-full mt-6">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="p-2">{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td className="p-2">
                <select
                  className="border p-1 rounded"
                  value={u.role}
                  onChange={(e) => updateRole(u._id, e.target.value)}
                >
                  <option value="reader">Reader</option>
                  <option value="writer">Writer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
