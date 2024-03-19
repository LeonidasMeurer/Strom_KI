#Datenbank
Es wird SQLite verwendet. 
Siehe config.py
Die Daten im File database.sqlite können über die Extension Sqlite Viewer in VisualStudio eingesehen werden

#Backend-Framwork 
Für das Backend-Framework wird Flask verwendet.

#Authentifizierung
Die Authentifizierung erfolgt über serverseitige Sessions. 
Bei jeden Request erhält der Server die Session-ID, um den User zu authentifizieren.

#App starten
1. Um App zu starten muss Redis gestartet werden.
2. Die App wird über den Befehl:
 -> flask --app service  run  
zum Laufen gebracht. 
