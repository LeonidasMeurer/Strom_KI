
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ScreenWidth } from '@rneui/base';
import { LineChart } from 'react-native-chart-kit';
import PredictionType from './predictionType'
import { useSelector, useDispatch } from 'react-redux'
import { predictPV, predictWindOnShore, predictWindOffShore, setLoadedPv, setLoadWindOffShore, setLoadedWindOnShore } from '../ReduxSlices/predictPowerSlice'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Predictor({ predict, yAxis, name, period, loaded }) {

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

  // Eingabe für die Tage 
  const [predictDays, setPredictDays] = useState(3);
  const [chosenPredictDay, setChosenPrectictDay] = useState(3);

  // Achsen des Diagramma
  let kWhYAxis = yAxis

  // Zeitraum
  let [periodData, setPeriodData] = useState(period);

  // hier für das Abrufen von Thunks
  const dispatch = useDispatch();

  // Damit die Daten nach erfolgreichem Login geladen werden
  useEffect(() => {
    if (success) {
      console.log("Daten werden nach erfolgreichem Login geladen")
      handlePrediction();
    }
  }, [success]);

  // sobald die Stromdaten laden, wird das Diagramm erneuert
  useEffect(() => {
    if (loaded) {
      console.log("Stromdaten wurden geladen")
      setPeriodData(period); // Zeitraum von x bix x
      let daysArray = createArray(predictDays); // X-Achse auf der Basis ausgewählter Tage

      setChartData({
        labels: daysArray,
        datasets: [
          {
            data: kWhYAxis,
          },
        ],
      });

      setLoading(false);
    }
  }, [loaded]);


  // Wähle passenden API-Aufruf
  function choseAPI(Type) {
    switch (Type) {
      case PredictionType.pv:
        dispatch(setLoadedPv(false))
        dispatch(predictPV(predictDays));
        break;

      case PredictionType.windOnShore:
        dispatch(setLoadedWindOnShore(false))
        dispatch(predictWindOnShore(predictDays));
        break;

      case PredictionType.windOffShore:
        dispatch(setLoadWindOffShore(false))
        dispatch(predictWindOffShore(predictDays));
        break;
    }
  }

  // Eingabe für die Vorhersage wird verarbeitet
  const handlePrediction = () => {
    setLoading(true);
    // Überprüfen, ob der eingegebene Wert eine Zahl ist (Not a Number)
    if ((Number.isInteger(Number(predictDays)))) {
      setChosenPrectictDay(predictDays);
      //API-CALL
      choseAPI(predict)
    }
  };

  // Hilfsmethode zum erstellen der X-Achse anhand der Tage
  function createArray(upTo) {
    return Array.from({ length: upTo }, (_, index) => index + 1);
  }

  // Konfiguration
  const lineChartConfig1 = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    pointBackgroundColor: 'black',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: 4,
      strokeWidth: 1,
      stroke: '#ffa726',
    }
  }

  const lineChartStyle = {
    marginVertical: 10,
    borderRadius: 15,

  }

  // Öffnen des Diagramms
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Für mehr Userbility

  const [zeitPunkt, setZeitPunkt] = useState("");
  const [strom, setStrom] = useState("0");
  const [stunden, setStunden] = useState("0");

  const onDataPointClick = ({ value, index }) => {
    // Handle the data point click event
    setZeitPunkt(periodData[index]);
    setStrom(value);
    setStunden(index);
  };

  let counter = chosenPredictDay * 24 + 1

  const getDotColors = ({ }) => {
    counter = counter - 1;
    if (counter % 24 === 0) {
      return "grey"
    } else {
      return "white"
    }
  };


  return (

    <View>
      <TouchableOpacity onPress={toggleExpand} style={styles.touchableOpacity}>
        <Text style={styles.touchableOpacityText}>{isExpanded ? `für Strom aus ${name} schließen` : `für Strom aus ${name} öffnen`}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView contentContainerStyle={{ flexDirection: 'column', alignItems: 'flex-start', paddingHorizontal: '20' }} style={styles.scrollviews}>

          <Text style={styles.scrollviewHeader}>{chosenPredictDay}-tägige Vorhersage</Text>

          <ScrollView horizontal contentContainerStyle={{ flexDirection: 'column', alignItems: 'flex-start', paddingHorizontal: '20' }} style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 }}>
            <LineChart
              data={chartData}
              width={300 + 300 * chosenPredictDay}
              height={250}
              xAxisLabel='.Tag'
              yAxisSuffix="kWh"
              yAxisInterval={1}
              chartConfig={lineChartConfig1}
              bezier
              style={lineChartStyle}
              onDataPointClick={onDataPointClick}
              getDotColor={getDotColors}

            />
            <Text style={{ marginBottom: 4 }}>*die kWh-Werte werden stündlich gemessen</Text>

            {chosenPredictDay !== null && (
              <View>
                <Text style={{ fontWeight: 'bold' }}>vom {periodData[0]} </Text>
                <Text style={{ fontWeight: 'bold' }}>bis {periodData[periodData.length - 1]}</Text>
              </View>
            )}
          </ScrollView>
          <Text style={styles.scrollviewHeader}>Gib die Tage zur Vorhersage an</Text>
          <View style={styles.containerPredict}>
            <TextInput style={styles.textInput} placeholder="Tage" keyboardType='numeric' value={predictDays} onChangeText={(text) => setPredictDays(text)} />
            <TouchableOpacity style={styles.searchButton} onPress={handlePrediction}>
              <Text style={styles.buttonText}>vorhersagen</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="lightgreen" />
              <Text style={styles.waitingText}>Bitte warten oder nochmal versuchen</Text>
            </View>)}

          {!(Number.isInteger(Number(predictDays))) && (
            <Text style={styles.errorText}>Bitte eine ganze Zahl eingeben!</Text>
          )
          }
          <Text style={styles.scrollviewHeader}>Informationen zum angeklickten Punkt</Text>
          <View style={styles.containerInfo}>
            <Text> <Text style={{ fontWeight: 'bold' }}>Zeitpunkt  </Text>{zeitPunkt}</Text>
            <Text> <Text style={{ fontWeight: 'bold' }}>Strom      </Text>  {strom} kWh</Text>
            <Text> <Text style={{ fontWeight: 'bold' }}>Stunden    </Text>{stunden} h</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}




const styles = StyleSheet.create({
  touchableOpacity: {
    width: ScreenWidth,
    backgroundColor: '#C3EFBA',
    margin: 10,
  },
  touchableOpacityText: {
    fontSize: 17,
    padding: 10,
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  collapse: {
    width: ScreenWidth,
    backgroundColor: 'lightgreen',
    margin: 10
  },
  scrollviews: {
    marginTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingHorizontal: 10,
    height: 'auto',
    width: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingBottom: 20,
  },
  scrollviewHeader: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  containerPredict: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  containerInfo: {
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  textInput: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  waitingText: {
    color: 'red',
    marginBottom: 7
  }
});
