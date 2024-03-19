
import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { useSelector } from 'react-redux'
import Predictor from './Analysen/prediction.js';
import PredictionType from './Analysen/predictionType.js'
import PredictorPrice from './Analysen/priceprediction.js';
import PredictorTotalPower from './Analysen/totalpowerprediction.js';
import { ScrollView } from 'react-native-gesture-handler';


export default function Analyse() {

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Für die Y-Achesen der Diagramme
  let kWhYAxisPV = useSelector((state) => state.predicterPower.kWhPv)
  let kWhYAxisWindOnShore = useSelector((state) => state.predicterPower.kWhWindOnShore)
  let kWhYAxisWindOffShore = useSelector((state) => state.predicterPower.kWhWindOffShore)

  //Loading
  let loadedPv = useSelector((state) => state.predicterPower.loadedPv)
  let loadedWindOnShore = useSelector((state) => state.predicterPower.loadedWindOnShore)
  let loadedWindOffShore = useSelector((state) => state.predicterPower.loadedWindOffShore)

  // Zeiträume
  let periodPv = useSelector((state) => state.predicterPower.dataPv)
  let dataWindOnShore = useSelector((state) => state.predicterPower.dataWindOnShore)
  let dataWindOffShore = useSelector((state) => state.predicterPower.dataWindOffShore)



  return (
    <LinearGradient colors={['white', 'lightgreen']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Vorhersagen für Deutschland</Text>
        <Predictor name={"PV-Anlagen"} predict={PredictionType.pv} yAxis={kWhYAxisPV} period={periodPv} loaded={loadedPv} />
        <Predictor name={"Windkraft am Ufer"} predict={PredictionType.windOnShore} yAxis={kWhYAxisWindOnShore} period={dataWindOnShore} loaded={loadedWindOnShore} />
        <Predictor name={"Windkraft am Land"} predict={PredictionType.windOffShore} yAxis={kWhYAxisWindOffShore} period={dataWindOffShore} loaded={loadedWindOffShore}></Predictor>
        <PredictorTotalPower />
        <PredictorPrice />
      </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    alignItems: 'center',
  }
});
