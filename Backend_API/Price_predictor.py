import os
import sys

import pandas as pd

from sklearn.preprocessing import StandardScaler

import matplotlib.pyplot as plt

from keras.models import load_model


from Photovoltaik_predictor import PhotovoltaikPredictor
from Wind_Off_Shore_predictor import WindOffShorePredictor
from Wind_On_Shore_predictor import WindOnShorePredictor
from Power_Usage_predictor import PowerPredictor



absolute_path = os.path.dirname(__file__)
relative_path = "models/Price/Price_model"
full_path = os.path.join(absolute_path, relative_path)


class PricePredictor():

    def get_Prediction(self):
        # GET DATA
        photovoltaik_predictor = PhotovoltaikPredictor()
        wind_on_shore_predictor = WindOnShorePredictor()
        wind_off_shore_predictor = WindOffShorePredictor()
        power_predictor = PowerPredictor()

        photo_pred = photovoltaik_predictor.get_Prediction(forecast_days=7, past_days=7)
        on_shore_pred = wind_on_shore_predictor.get_Prediction(forecast_days=7, past_days=7)
        off_shore_pred = wind_off_shore_predictor.get_Prediction(forecast_days=7, past_days=7)
        power_pred = power_predictor.get_Prediction()


        hourly_dataframe = power_pred


        hourly_dataframe = hourly_dataframe.join(off_shore_pred)
        hourly_dataframe = hourly_dataframe.join(on_shore_pred)
        hourly_dataframe = hourly_dataframe.join(photo_pred)



        model = load_model(full_path)

        # STANDARDIZE
        scaler = StandardScaler().fit(hourly_dataframe)
        hourly_dataframe_preprocessed = scaler.transform(hourly_dataframe)


        pred_price = model.predict(hourly_dataframe_preprocessed)

        pred_price=pd.DataFrame(pred_price, index=hourly_dataframe.index)


        # STANDARDIZE PRICE RESULT
        # Preis Schwankungen sind extrem stark, deswegen nur Trend aber keine absoluten Zahlen vorhersagbar
        '''scaler = StandardScaler().fit(pred_price)
        pred_price = scaler.transform(pred_price)'''


        hourly_dataframe['Price'] = pred_price
        
        '''hourly_dataframe.plot(subplots=True, figsize=(6, 6))
        plt.show()

        plt.plot(hourly_dataframe['Power Usage'])
        plt.legend(['Price'])
        plt.show()'''

        return hourly_dataframe
    
'''pp = PricePredictor()
test = pp.get_Prediction()
plt.plot(test)
plt.show()'''
        

