import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from "@reduxjs/toolkit";



export const predictTotalPrice = createAsyncThunk('get/predictTotalPrice',
  async () => {
    response = await fetch(`http://10.0.2.2:5002/predict_price`);
    const data = await response.json();
    return data;
  });



export const predictPriceSlice = createSlice({
  name: 'predicterPrice',
  initialState: {
    kWhTotalPrice: [0],
    dataPrice: [],
    priceLoaded: false
  },
  reducers: {
    setPriceLoaded: (state, action) => {
      state.priceLoaded = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(predictTotalPrice.fulfilled, (state, action) => {
      let data = action.payload;
      let letzteWerte = data.data.map(inneresArray => inneresArray[inneresArray.length - 1]);
      console.log(letzteWerte);

      state.kWhTotalPrice = letzteWerte;
      state.dataPrice = formatTime(action.payload["index"]);
      state.priceLoaded = true;
      console.log("gesamter Preis Fulfilled");

    })
  }
})


// Action creators are generated for each case reducer function
export const { setPriceLoaded } = predictPriceSlice.actions

export default predictPriceSlice.reducer




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