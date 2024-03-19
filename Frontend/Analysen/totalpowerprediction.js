
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ScreenWidth } from '@rneui/base';
import { LineChart } from 'react-native-chart-kit';

import { useSelector, useDispatch } from 'react-redux'
import { predictTotalPower, setLoadedTotalPower} from '../ReduxSlices/predictPowerSlice'

import { TouchableOpacity } from 'react-native-gesture-handler';

export default function PredictorPrice() {

  // Achsen des Diagramma
  let kWhYAxis = useSelector((state) => state.predicterPower.kWhTotalPower)
  let kWhXAxis = [1, 2, 3, 4, 5, 6, 7] // Es gibt nur wöchentliche Vorhersagen

  let periodData = useSelector((state) => state.predicterPower.dataPower)
  //Ergebnis des Logins
  let success = useSelector((state) => state.auth.isAuthenticated)

  //Loading
  const [loading, setLoading] = useState(true);

  // Diagrammdaten
  const [chartData, setChartData] = useState({
    labels: [0],
    datasets: [
      {
        data: [0],
      },
    ],
  });

  //Ergebnis des Api-Calls
  let loaded = useSelector((state) => state.predicterPower.loadedTotalPower)

  // hier für das Abrufen von Thunks
  const dispatch = useDispatch();

  function handleCall() {
    setLoading(true)
    dispatch(setLoadedTotalPower(false))
    dispatch(predictTotalPower());
  }

  // Eingabe für die Vorhersage wird verarbeitet
  useEffect(() => {
    handleCall()
  }, [success]);


  // sobald die Preisdaten laden, wird das Diagramm erneuert
  useEffect(() => {
    console.log(loaded)
    if (loaded) {
      console.log("Preis wurde geladen")
      setChartData({
        labels: kWhXAxis,
        datasets: [
          {
            data: kWhYAxis,
          },
        ],
      });

      setLoading(false);
    }
  }, [loaded]);

  //Konfiguration 
  const lineChartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "0",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  }

  const lineChartStyle = {
    marginVertical: 8,
    borderRadius: 16
  }

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (

    <View>
      <TouchableOpacity onPress={toggleExpand} style={{ width: ScreenWidth, backgroundColor: '#C3EFBA', margin: 10 }}>
        <Text style={{ fontSize: 17, padding: 10, alignSelf: 'center', fontWeight: 'bold' }}>{isExpanded ? `zum gesamten Strom schließen` : `zum gesamten Strom öffnen`}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView horizontal contentContainerStyle={{ flexDirection: 'column' }} style={{ marginTop: 20, paddingRight: 20, paddingLeft: 20, height: '300', width: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.65)', paddingBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Vorhersage des gesamten Stroms</Text>
          <View style={{ marginRight: 60 }}>
            <LineChart
              data={chartData}
              width={500}
              height={220}
              xAxisLabel='.Tag'
              yAxisSuffix="kWh"
              yAxisInterval={1}
              chartConfig={lineChartConfig}
              style={lineChartStyle}
            />
          </View>
          <Text style={{ marginLeft: 10 }}>vom {periodData[0]} bis {periodData[periodData.length - 1]}</Text>
          <TouchableOpacity style={styles.searchButton} onPress={handleCall}>
            <Text style={styles.buttonText}>update</Text>
          </TouchableOpacity>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="black" />
              <Text style={styles.waitingText}>Bitte warten oder nochmal versuchen</Text>
            </View>)}
        </ScrollView>
      )}
    </View>
  );
}




const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'flex-start',
  },
  waitingText: {
    color: 'red',
    marginBottom: 7
  },
  searchButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 8,
    width: 100,
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  }
});
