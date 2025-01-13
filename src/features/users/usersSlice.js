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

// Create an async thunk for fetching users (you can replace the URL with your own)
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  console.log("response", response);
  return response.json();
});

// Create the slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: usersAdapter.addOne, // Add a single user
    addUsers: usersAdapter.addMany, // Add multiple users
    removeUser: usersAdapter.removeOne, // Remove a user by ID
    updateUser: usersAdapter.updateOne, // Update a user by ID
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
      });
  },
});

// Export actions for use in components
export const { addUser, addUsers, removeUser, updateUser } = usersSlice.actions;

// Export the adapter selectors
export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => state.users);

export default usersSlice.reducer;
