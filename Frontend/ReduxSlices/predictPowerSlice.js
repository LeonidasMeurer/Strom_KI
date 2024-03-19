import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from "@reduxjs/toolkit";



export const predictPV = createAsyncThunk('get/predictPV',
    async (days) => {
        response = await fetch(`http://10.0.2.2:5002/predict_photovoltaik?forecast_days=${days}`);
        const data = await response.json();
        return data;
    });

export const predictWindOnShore = createAsyncThunk('get/predictWindOnShore',
    async (days) => {
        response = await fetch(`http://10.0.2.2:5002/predict_on_shore?forecast_days=${days}`);
        const data = await response.json();
        return data;
    });

export const predictWindOffShore = createAsyncThunk('get/predictWindOffShore',
    async (days) => {
        response = await fetch(`http://10.0.2.2:5002/predict_off_shore?forecast_days=${days}`);
        const data = await response.json();
        return data;
    });

export const predictTotalPower = createAsyncThunk('get/predictTotalPower',
    async () => {
        response = await fetch(`http://10.0.2.2:5002/predict_power`);
        const data = await response.json();
        return data;
    });



export const predictPowerSlice = createSlice({
    name: 'predicterPower',
    initialState: {
        kWhPv: [0],
        kWhWindOnShore: [0],
        kWhWindOffShore: [0],
        kWhTotalPower: [0],

        dataPv: [],
        dataWindOnShore: [],
        dataWindOffShore: [],
        dataPower: [],

        loadedPv: false,
        loadedWindOnShore: false,
        loadedWindOffShore: false,
        loadedTotalPower: false
    },
    reducers: {
        setLoadedPv: (state, action) => {
            state.loadedPv = action.payload;
        },
        setLoadedWindOnShore: (state, action) => {
            state.loadedWindOnShore = action.payload;
        },
        setLoadWindOffShore: (state, action) => {
            state.loadedWindOffShore = action.payload;
        },
        setLoadedTotalPower: (state, action) => {
            state.loadedTotalPower = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(predictPV.fulfilled, (state, action) => {
            console.log("PV Fulfilled");
            console.log(action.payload["data"].flat());
            state.kWhPv = action.payload["data"].flat()
            state.dataPv = formatTime(action.payload["index"].flat())
            state.loadedPv = true;
        }),
            builder.addCase(predictWindOnShore.fulfilled, (state, action) => {
                console.log("Wind Ufer Fulfilled");
                console.log(action.payload["data"].flat());
                state.kWhWindOnShore = action.payload["data"].flat()
                state.dataWindOnShore = formatTime(action.payload["index"].flat())
                state.loadedWindOnShore = true;
            }),
            builder.addCase(predictWindOffShore.fulfilled, (state, action) => {
                console.log("Wind Land Fulfilled");
                console.log(action.payload["data"].flat());
                state.kWhWindOffShore = action.payload["data"].flat()
                state.dataWindOffShore = formatTime(action.payload["index"].flat())
                state.loadedWindOffShore = true;
            }),
            builder.addCase(predictTotalPower.fulfilled, (state, action) => {
                console.log("gesamter Strom Fulfilled");
                let data = action.payload;
                let letzteWerte = data.data.map(inneresArray => inneresArray[inneresArray.length - 1]);
                console.log(letzteWerte);
                state.kWhTotalPower = letzteWerte;
                state.dataPower = formatTime(action.payload["index"]);
                state.loadedTotalPower = true
            })
    }
})


// Action creators are generated for each case reducer function
export const { setLoadedPv, setLoadedWindOnShore, setLoadWindOffShore, setLoadedTotalPower } = predictPowerSlice.actions

export default predictPowerSlice.reducer




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