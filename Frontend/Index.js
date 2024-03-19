import 'react-native-gesture-handler';
import * as React from 'react';
import { View, Text, Image, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Login from './Login';
import Geraetemanager from './Geraetemanager/Geraetmanager';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Button } from '@rneui/base';
import { LinearGradient } from 'expo-linear-gradient';
import Analyse from './Analyse';
import { Provider, useSelector, useDispatch } from 'react-redux'
import store from './store'
import UserAnalyse from './UserAnalyse';
import { handleLogout } from './Logout';
import Registration from './Registration';
import Kontakt from './Kontakt';
import Tagesausgabe from './Tagesausgabe';



const imageFrederik = require("./images/Bild1.png")


function StartScreen({ navigation }) {
  return (
    <LinearGradient colors={['orange', 'lightgreen', 'green']} style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image source={imageFrederik} style={{ height: '25%', resizeMode: 'contain', marginBottom: '1%', marginTop: '15%' }}></Image>
        <Text style={{ fontSize: 15, marginBottom: '10%', color: 'white' }}>Frederik</Text>
        <Text style={{ color: 'white', fontSize: 30 }}>Willkommen bei Frederik</Text>

        <View style={{ width: 110, alignSelf: 'center', marginTop: '15%' }}><Button radius={10} color="green" title="Anmelden" onPress={() => navigation.navigate('Login')} /></View>

        <View style={{ width: 110, alignSelf: 'center', marginTop: '5%' }}><Button radius={10} color="green" title="Registrieren" onPress={() => navigation.navigate('Registration')} /></View>

      </View></LinearGradient>

  );
}

// Navigationsleiste 
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  LogBox.ignoreAllLogs();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  //console.log(`Is Authenticated: ${isAuthenticated}`);
  const dispatch = useDispatch();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {isAuthenticated && (
        <DrawerItem
          label="Logout"
          onPress={() => {
            handleLogout(dispatch, props.navigation);
          }}
        />
      )}
    </DrawerContentScrollView>
  );
}

function MainApp() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <Provider store={store}>
      <NavigationContainer >
        <Drawer.Navigator
          initialRouteName="Start"
          drawerType="front"
          screenOptions={{
            activeTintColor: '#e91e63',
            itemStyle: { marginVertical: 10, },
          }}
          drawerContent={props => <CustomDrawerContent {...props} />}
        >
          {!isAuthenticated && (
            <>
              <Drawer.Screen name="Start" component={StartScreen} />
              <Drawer.Screen name="Login" component={Login} />
              <Drawer.Screen name="Registration" component={Registration} />
              <Drawer.Screen name='Kontakt' component={Kontakt} />
            </>
          )}
          {isAuthenticated && (
            <>
              <Drawer.Screen name='Profil' component={UserAnalyse} />
              <Drawer.Screen name="Gerätemanager" component={Geraetemanager} />
              <Drawer.Screen name='Analyse' component={Analyse} />     
              <Drawer.Screen name='Vorschläge für die Stromnutzung' component={Tagesausgabe}/>
              <Drawer.Screen name='Kontakt' component={Kontakt} />
              {/* Weitere authentifizierte Screens */}
            </>
          )}
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default MainApp;
