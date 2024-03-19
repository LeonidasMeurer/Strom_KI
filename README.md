# Frederik


## Docker Container KI-API
```docker
docker pull leonidasmeurer/frederick_api:1.4.1
```
```docker
docker run -p 127.0.0.1:5002:5002 leonidasmeurer/frederick_api:1.4.1
```

Siehe: 127.0.0.1:5002 um API u testen

Für mehr Information zum Nutzen der API siehe ReadMe.md in Backend_API.

Die Modelle im Docker-Container selbst laufen einwandfrei.

Um den Code bzw. die Modelle mittels der Model_Builder bzw. der predictor zu testen werden die Modelle aus dem models Ordner geladen.
Leider funktionieren diese aber nicht, da die Binary-Datein beim pushen/pullen über git beschädigt werden.
Es gibt zwei Lösungen für dieses Problem:

1.  Die Dateien aus dem jeweiligen models Ordner Löschen z.B. models/Off_shore/Off_shore und das Model neu Trainieren.
Bei manchen Modellen dauert das Laden der Wetterdaten jedoch einige Zeit, da diese über einen längeren Zeitraum geladen werden müssen um keinen API-Timeout zu produzieren.

2. Den kompletten models Ordner löschen und mit einem heruntergeladenen model Ordner ersetzen.
Link zu dem Model_order: [HM_OneDrive_Ordner](https://hmedu-my.sharepoint.com/:f:/g/personal/meurer_hm_edu/EkvySXArEKtNvJxDx8tGW_UBXPDo7LOjpmFYNBpWds-DAQ?e=BubHdB)

Das Front-End nutzt den Docker Container, also entstehen beim Testen der App diesbezüglich keine Probleme. 
Das ersetzten der Modelle ist nur notwendig, um den Code direkt zu testen.


## Frederik-Backend
Bevor das Frontend gestartet wird, muss dieses Backend zum Laufen gebracht werden.

# Datenbank
Es wird SQLite verwendet. 
Siehe config.py
Die Daten im File database.sqlite können über die Extension Sqlite Viewer in VisualStudio eingesehen werden.

# Backend-Framwork 
Für das Backend-Framework wird Flask verwendet.

# Authentifizierung
Die Authentifizierung erfolgt über serverseitige Sessions. 
Bei jeden Request erhält der Server die Session-ID, um den User zu authentifizieren.

# Backend starten
1. Um das Backend zu starten muss Redis gestartet werden.
https://redis.io/docs/install/install-redis/

2. Python mit dem Packagemanagementsystem pip muss installiert sein.
Entwickelt wurde das Backend mit der Python-Version 3.10.8.
https://www.python.org/downloads/ 

3. Darauf sollte Flask über pip mit allen wichtigen Packages, die im Requirements-File sind, installiert werden

Flask
flask_cors
flask-sqlalchemy
flask-bcrypt
redis
flask-Mail

->pip install -r requirements.txt


2. Zum Schluss muss die App über den Befehl:
 -> flask --app service  run  
zum Laufen gebracht werden. 

Man muss sich im Backend-Ordner befinden.
-> cd Backend


## Frederik-Frontend
Sobald die beiden Backend-Services stehen, kann das Frontend gestartet werden.

# verwendetes UI-Framework
React Native 

# App starten
1. Emulator: Die App wurde mithilfe des Android-Emulators entwickelt, sodass dieser davor noch über Android Studio installiert werden sollte. Falls mit dem iOS-Emulator oder der Expo-Go App (am Handy) die Anwendung gestartet werden soll, muss die IP-Adresse angepasst werden.

2. JDK und Node müssen für React Native installiert sein. Am schnellsten geht dies über Chocolatey.

choco install -y nodejs-lts microsoft-openjdk17

Wenn bereits Node auf dem System installiert ist, sollte darauf geachtet werden, dass es sich um Node 18 oder eine neuere Version handelt. Falls bereits ein JDK (Java Development Kit) auf dem System vorhanden ist, wird JDK 17 empfohlen. Probleme könnten auftreten, wenn höhere JDK-Versionen verwendet werden.


3. Darauf muss React Native und weitere Dependencies installiert werden. 
->siehe package.json

Ausführliche Anleitung
https://reactnative.dev/docs/environment-setup?platform=android&guide=native 

https://reactnative.dev/docs/getting-started?guide=android

4. App starten
1.zuerst muss in den Ordner Frontend gewechselt werden
cd Frontend
2.App kann über npm gestartet werden
->npm start


# Sonstiges
Ansonsten bitten wir um Geduld beim Laden der Daten aus dem KI-Backend. Dies kann mehrere Minuten dauern.
 Im Videoprojekt.mp4 kann man sich das Starten der App nach dem Installieren der nötigen Tools anschauen. Es wird auch ein Überblick zu den aktuellen Funktionen gegeben.


