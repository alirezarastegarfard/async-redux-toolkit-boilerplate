import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  selectAllUsers,
  addUser,
  removeUser,
  updateUser,
} from "./features/users/usersSlice";

function App() {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const loading = useSelector((state) => state.users.loading);
  const error = useSelector((state) => state.users.error);

  const [newUserName, setNewUserName] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editUserName, setEditUserName] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddUser = () => {
    if (newUserName.trim()) {
      const newUser = { id: Date.now().toString(), name: newUserName };
      dispatch(addUser(newUser));
      setNewUserName("");
    }
  };

  const handleRemoveUser = (id) => {
    dispatch(removeUser(id));
  };

  const handleEditUser = () => {
    if (editUserId && editUserName.trim()) {
      dispatch(updateUser({ id: editUserId, changes: { name: editUserName } }));
      setEditUserId(null);
      setEditUserName("");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Users</h1>

      <div>
        <input
          type="text"
          placeholder="New user name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      {editUserId && (
        <div>
          <input
            type="text"
            placeholder="Edit user name"
            value={editUserName}
            onChange={(e) => setEditUserName(e.target.value)}
          />
          <button onClick={handleEditUser}>Update User</button>
        </div>
      )}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}{" "}
            <button onClick={() => handleRemoveUser(user.id)}>Remove</button>{" "}
            <button
              onClick={() => {
                setEditUserId(user.id);
                setEditUserName(user.name);
              }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
