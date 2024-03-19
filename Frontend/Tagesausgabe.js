import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@rneui/themed";
import { ListItem, Avatar, Image } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}.${month}.${year}`;
};

function berechneStündlicheNutzung(stundenArray, geraeteArray) {
  const geraeteSortiert = geraeteArray.sort((a, b) => {
    if (a.leistung > b.leistung) return -1;
    if (a.leistung < b.leistung) return 1;
    return 0;
  });
  let resultArray = [];

  for (let i = 0; i < stundenArray.length; i++) {
    let restlicheKilowattstunden = stundenArray[i];

    resultArray[i] = {
      verwendbareGeraete: [],
    };

    for (let j = 0; j < geraeteSortiert.length; j++) {
      const { name, anzahl, leistung, nutzungsdauer } = geraeteSortiert[j];

      if (leistung / nutzungsdauer <= restlicheKilowattstunden) {
        resultArray[i].verwendbareGeraete.push(name);
        restlicheKilowattstunden -= leistung / nutzungsdauer;
      }
    }
  }

  return resultArray;
}

function Tagesausgabe(navigation) {
  const [dataArray, setDataArray] = useState([]);
  const [dataArrayTag1, setDataArrayTag1] = useState([]);
  const [dataArrayTag2, setDataArrayTag2] = useState([]);
  const [dataArrayTag3, setDataArrayTag3] = useState([]);

  let success = useSelector((state) => state.auth.isAuthenticated);
  let kWh = useSelector((state) => state.userPredicter.userKWhPv);
  let loaded = useSelector((state) => state.userPredicter.loadedUserPv);
  useEffect(() => {
    if (loaded) {
      console.log("success", success);

      const roundedDataArray = kWh.map((value) =>
        Math.max(0, parseFloat(value.toFixed(3)))
      );
      setDataArray(roundedDataArray);
      setDataArrayTag1(roundedDataArray.slice(0, 24));
      setDataArrayTag2(roundedDataArray.slice(24, 48))
      setDataArrayTag3(roundedDataArray.slice(48, 72))
    }
  }, [loaded]);

  const [geraete, setGeraete] = useState([]);

  useEffect(() => {
    // Führen Sie die GET-Anfrage durch, wenn die Komponente montiert wird
    fetch("http://10.0.2.2:5000/geraete", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Fügen Sie hier weitere Header hinzu, wenn benötigt
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Hier kannst du die gewünschten Berechnungen durchführen
        const modifiedGeraete = data.geraete.map((geraet) => ({
          ...geraet,
          nutzungsdauer: geraet.nutzungsdauer / 60, // Nutzungszeit in Stunden
          leistung: geraet.leistung / 1000, // Leistung in Kilowatt
        }));

        setGeraete(modifiedGeraete);
      })
      .catch((error) => {
        console.error("Fehler bei der Anfrage:", error);
      });
  }, []);

  const tagesNutzungArray1 = berechneStündlicheNutzung(dataArrayTag1, geraete);
  const tagesNutzungArray2 = berechneStündlicheNutzung(dataArrayTag2, geraete);
  const tagesNutzungArray3 = berechneStündlicheNutzung(dataArrayTag3, geraete);

  const createListDayData = (dataArray, tagesNutzungArray) => {
    const listData = [];

    for (let i = 0; i < 24; i++) {
      let subtitle = "";
      if (
        !tagesNutzungArray ||
        !tagesNutzungArray[i] ||
        !tagesNutzungArray[i].verwendbareGeraete ||
        tagesNutzungArray[i].verwendbareGeraete.length === 0
      ) {
        subtitle = "Gerade steht kaum Strom zur Verfügung!";
      } else {
        const usableDevices =
          tagesNutzungArray[i].verwendbareGeraete.join(", ");
        subtitle = `Nutzbare Geräte: ${usableDevices}`;
      }
      const listItem = {
        kWh: dataArray[i] + " kWh",
        subtitle: subtitle,
        day: `${i < 10 ? "0" : ""}${i}:00`,
      };

      listData.push(listItem);
    }
    return listData;
  };

  // Verwendung der Funktion, um die Liste mit Daten zu erstellen
  const listDay = createListDayData(dataArrayTag1, tagesNutzungArray1);
  const listTommorrow = createListDayData(dataArrayTag2, tagesNutzungArray2);
  const listAfterTommorrow = createListDayData(
    dataArrayTag3,
    tagesNutzungArray3
  );

  const today = new Date();
  const formattedToday = formatDate(today);

  // Datum von morgen
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const formattedTomorrow = formatDate(tomorrow);

  // Datum von übermorgen
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);
  const formattedDayAfterTomorrow = formatDate(dayAfterTomorrow);

  // #D0F0C0
  return (
    <ScrollView>
      <LinearGradient colors={["white", "lightgreen"]} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            horizontal
            contentContainerStyle={{ flexDirection: "row" }}
            style={{
              marginTop: 40,
              height: "auto",
              width: "auto",
              backgroundColor: "rgba(255, 255, 255, 0.65)",
              paddingTop: 10,
              paddingBottom: 20,
            }}
          >
            <Card style={{}} containerStyle={{ borderRadius: 10 }}>
              <Card.Title style={{ fontSize: 23 }}>
                <Text>Tagesplan {formattedToday}</Text>
              </Card.Title>
              {listDay.map((l, i) => (
                <ListItem style={{}} key={i} bottomDivider>
                  <Text style={{ fontSize: 25, width: 70 }}>{l.day}</Text>
                  <ListItem.Content>
                    <ListItem.Title>
                      <Text style={{ fontWeight: "bold" }}>{l.kWh}</Text>
                    </ListItem.Title>
                    <ListItem.Subtitle style={{ width: 100 }}>
                      {l.subtitle}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))}
            </Card>
            <Card style={{}} containerStyle={{ borderRadius: 10 }}>
              <Card.Title style={{ fontSize: 23 }}>
                <Text>Tagesplan {formattedTomorrow}</Text>
              </Card.Title>
              {listTommorrow.map((l, i) => (
                <ListItem style={{}} key={i} bottomDivider>
                  <Text style={{ fontSize: 25, width: 70 }}>{l.day}</Text>
                  <ListItem.Content>
                    <ListItem.Title>
                      <Text style={{ fontWeight: "bold" }}>{l.kWh}</Text>
                    </ListItem.Title>
                    <ListItem.Subtitle style={{ width: 100 }}>
                      {l.subtitle}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))}
            </Card>
            <Card style={{}} containerStyle={{ borderRadius: 10 }}>
              <Card.Title style={{ fontSize: 23 }}>
                <Text>Tagesplan {formattedDayAfterTomorrow}</Text>
              </Card.Title>
              {listAfterTommorrow.map((l, i) => (
                <ListItem style={{}} key={i} bottomDivider>
                  <Text style={{ fontSize: 25, width: 70 }}>{l.day}</Text>
                  <ListItem.Content>
                    <ListItem.Title>
                      <Text style={{ fontWeight: "bold" }}>{l.kWh}</Text>
                    </ListItem.Title>
                    <ListItem.Subtitle style={{ width: 100 }}>
                      {l.subtitle}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))}
            </Card>
          </ScrollView>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

export default Tagesausgabe;
