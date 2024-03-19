import { configureStore } from '@reduxjs/toolkit'
import authSlice from './ReduxSlices/authSlice'
import userPredictSlice from './ReduxSlices/userPredictSlice'
import predictPowerSlice from './ReduxSlices/predictPowerSlice'
import predictPriceSlice from './ReduxSlices/predictPriceSlice'

export default configureStore({
  reducer: {
    auth: authSlice,
    userPredicter: userPredictSlice,
    predicterPower: predictPowerSlice,
    predicterPrice: predictPriceSlice
  },
})