import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from './ReduxSlices/authSlice';
import { setLoaded } from './ReduxSlices/userPredictSlice';
import { setPriceLoaded } from './ReduxSlices/predictPriceSlice';
import { setLoadedPv, setLoadedWindOnShore, setLoadWindOffShore} from './ReduxSlices/predictPowerSlice';


export const handleLogout = async (dispatch, navigation) => {
    
  //REST Aufruf
  try {
    const response = await fetch('http://10.0.2.2:5000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Kein Body nötig, da Logout keine weiteren Informationen benötigt
    });

    if (response.ok) {
      // Logout erfolgreich
      dispatch(logoutSuccess());
      console.log("Erfolgreicher Logout")
      navigation.navigate('Login'); // Navigiere zurück zum Anmeldebildschirm 
      dispatch(setLoaded(false))
      dispatch(setPriceLoaded(false))
      dispatch(setLoadedPv(false))
      dispatch(setLoadedWindOnShore(false))
      dispatch(setLoadWindOffShore(false))

    } else {
      // Logout fehlgeschlagen
      console.error('Abmeldung fehlgeschlagen');
    }
  } catch (error) {
    console.error('Fehler bei der Abmeldung:', error);
  }
};
