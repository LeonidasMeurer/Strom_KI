
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const registerUser = createAsyncThunk('posts/register',
  async (userData) => {
    const response = await fetch('http://10.0.2.2:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();

  });



export const loginUser = createAsyncThunk('auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://10.0.2.2:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  });





export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    email: null,
    pwk: null,
    placeName: null,
    placeLat: null,
    placeLong: null,
    error: null
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      //state.user = action.payload; // Nehmen wir an, die Payload ist der Benutzer
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.email = action.payload["email"]
      state.pwk = action.payload["pwk"]
      state.placeName = action.payload["placeName"]
      state.placeLat = action.payload["placeLat"]
      state.placeLong = action.payload["placeLong"]
      console.log("Erfolgreiche Registrierung");
    }),
      builder.addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.email = action.payload["email"]
        state.pwk = action.payload["pwk"]
        state.placeName = action.payload["placeName"]
        state.placeLat = action.payload["placeLat"]
        state.placeLong = action.payload["placeLong"]
        console.log("Erfolgreicher Login");
        state.error = null;
      })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.error = action.payload || 'Login fehlgeschlagen';
    });
  }
});

// Aktionen exportieren
export const { loginSuccess, logoutSuccess } = authSlice.actions;

// Den Reducer exportieren
export default authSlice.reducer;