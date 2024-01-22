import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    currentUser: null,
    error: null,
    loading: false,
    validationErr: [],
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        Start: (state) => {
            state.loading = true;
        },
        Success: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        Filure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        Validation: (state, action) => {
            state.validationErr = action.payload;
            state.loading = false;
        },
        DeleteUser: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        }

    }
})

export const { Start, Success, Filure, Validation, DeleteUser } = userSlice.actions;
export default userSlice.reducer;