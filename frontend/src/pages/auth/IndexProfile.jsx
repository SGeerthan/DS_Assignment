import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "../../components/Dashboard";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";

const IndexUser = () => {
  const [users, setUsers] = useState([]);
  const [editingRole, setEditingRole] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5559/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5559/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      setEditingRole({});
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5559/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <Dashboard>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">No</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user._id} className="border-b">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    {editingRole[user._id] ? (
                      <select
                        value={editingRole[user._id]}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="taxpayer">Taxpayer</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="capitalize">{user.role}</span>
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() =>
                        setEditingRole((prev) => ({
                          ...prev,
                          [user._id]: user.role,
                        }))
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      <AiOutlineEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                    >
                      <MdOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Dashboard>
  );
};

export default IndexUser;
