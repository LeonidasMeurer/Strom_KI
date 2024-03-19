import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from "@reduxjs/toolkit";


export const predictUserPv = createAsyncThunk('get/predictUserPv',
    async (days, lat, long, pWk) => {
        response = await fetch(`http://10.0.2.2:5002/predict_photovoltaik?forecast_days=${days}&latitude=${lat}&longitude=${long}&pWk=${pWk}`);
        const data = await response.json();
        return data;
    });

export const userPredictSlice = createSlice({
    name: 'userPredicter',
    initialState: {
        userKWhPv: [],
        userDataPv: [],
        loadedUserPv: false
    },
    reducers: {
        setLoaded: (state, action) => {
            state.loadedUserPv = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(predictUserPv.fulfilled, (state, action) => {
            console.log("PV User Fulfilled");
            console.log(action.payload["data"].flat());
            state.userKWhPv = action.payload["data"].flat()
            state.userDataPv = formatTime(action.payload["index"])
            state.loadedUserPv = true;
        })
    }
})

export const { setLoaded } = userPredictSlice.actions

export default userPredictSlice.reducer




//Hilfsmethoden

// Formatieren der Zeit
function formatTime(array) {
    let timeFormmatted = [];
    array.forEach(element => {
        var timestamp = parseInt(element);
        var date = new Date(timestamp);
        var formattedDate = date.toLocaleString();
        timeFormmatted.push(formattedDate); // Formatierte Zeit einfügen
    });

    return timeFormmatted
}