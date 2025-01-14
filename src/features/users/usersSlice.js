import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";

// Create an adapter for the users
const usersAdapter = createEntityAdapter({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name), // Sort by name alphabetically
});

// Initial state
const initialState = usersAdapter.getInitialState({
  loading: false,
  error: null,
});

// Create an async thunk for fetching users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  return response.json();
});

// Async thunk for adding a user
export const addUserAsync = createAsyncThunk(
  "users/addUserAsync",
  async (user) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }
);

// Async thunk for removing a user by ID
export const removeUserAsync = createAsyncThunk(
  "users/removeUserAsync",
  async (userId) => {
    await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
      method: "DELETE",
    });
    return userId; // Return the ID of the removed user
  }
);

// Async thunk for updating a user
export const updateUserAsync = createAsyncThunk(
  "users/updateUserAsync",
  async (updatedUser) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${updatedUser.id}`,
      {
        method: "PUT",
        body: JSON.stringify(updatedUser),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  }
);

// Create the slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: usersAdapter.addOne, // Add a single user (local state)
    addUsers: usersAdapter.addMany, // Add multiple users (local state)
    removeUser: usersAdapter.removeOne, // Remove a user (local state)
    updateUser: usersAdapter.updateOne, // Update a user (local state)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        usersAdapter.setMany(state, action.payload); // Store users in the adapter
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addUserAsync.fulfilled, (state, action) => {
        // Add the new user to the state after a successful API call
        usersAdapter.addOne(state, action.payload);
      })
      .addCase(removeUserAsync.fulfilled, (state, action) => {
        // Remove the user from the state after a successful API call
        usersAdapter.removeOne(state, action.payload);
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        // Update the user in the state after a successful API call
        usersAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      });
  },
});

// Export actions for use in components
export const { addUser, addUsers, removeUser, updateUser } = usersSlice.actions;

// Export the adapter selectors
export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => state.users);

export default usersSlice.reducer;
