Aktuelle Docker Version 1.4.1

# Build Docker Image

docker buildx build . -t leonidasmeurer/frederick_api:1.4.1
docker run -p 127.0.0.1:5002:5002 leonidasmeurer/frederick_api:1.4.1
docker push leonidasmeurer/frederick_api:1.4.1


# Pull Docker Image

docker pull leonidasmeurer/frederick_api:1.4.1
docker run -p 127.0.0.1:5002:5002 leonidasmeurer/frederick_api:1.4.1

Go to: 127.0.0.1:5002

# API
Zu finden in dem File service.py

# Testen
Zum Testen der API steht das File Test_Server_CORS.html zu verfügung.

# Api Calls
# Predict Photovoltaik (Gesamt Deutschland)
Route:
/predict_photovoltaik

Argumente:
forecast_days: int

Anzahl an Tagen die predicted werden sollen

Bsp.:
http://127.0.0.1:5002/predict_photovoltaik?forecast_days=3

Response: JSON
Der INDEX ist im Unix timestamp in millisekunden angegeben!

{
    "columns": [
        "Photovoltaik"
    ],
    "index": [
        1703199600000,
        1703203200000,
        ......
    ],
    "data": [
        [
            19900.25
        ],
        [
            17626.15234375
        ],
        ......
    ]
}


# Predict Photovoltaik (Privat Haushalt)
Route:
/predict_photovoltaik

Argumente:
forecast_days: int
latitude: float
longitude: float
pWk: int (default = 1)

Mittels Koordinaten und Tagen kann die Stromerzeugung eines Haushaltes abhängig von pWk predicted werden
Für mehr Infos: https://www.wegatech.de/ratgeber/photovoltaik/grundlagen/kwp-kwh/

Bsp.:
http://127.0.0.1:5002/predict_photovoltaik?forecast_days=3&latitude=53.25046515527486&longitude=8.115672386637337&pWk=1

Response: JSON
Der INDEX ist im Unix timestamp in millisekunden angegeben!

{
    "columns": [
        "Photovoltaik"
    ],
    "index": [
        1703199600000,
        1703203200000,
        ......
    ],
    "data": [
        [
            19900.25
        ],
        [
            17626.15234375
        ],
        ......
    ]
}


# Predict Off Shore (Gesamt Deutschland)
Route:
/predict_off_shore

Argumente:
forecast_days: int

Anzahl an Tagen die predicted werden sollen

Bsp.:
http://127.0.0.1:5002/predict_off_shore?forecast_days=7

Response: JSON
Der INDEX ist im Unix timestamp in millisekunden angegeben!

{
    "columns": [
        "Wind Offshore"
    ],
    "index": [
        1703199600000,
        1703203200000,
        ......
    ],
    "data": [
        [
            19900.25
        ],
        [
            17626.15234375
        ],
        ......
    ]
}


# Predict On Shore (Gesamt Deutschland)
Route:
/predict_on_shore

Argumente:
forecast_days: int

Anzahl an Tagen die predicted werden sollen

Bsp.:
http://127.0.0.1:5002/predict_on_shore?forecast_days=2

Response: JSON
Der INDEX ist im Unix timestamp in millisekunden angegeben!

{
    "columns": [
        "Wind Onshore"
    ],
    "index": [
        1703199600000,
        1703203200000,
        ......
    ],
    "data": [
        [
            19900.25
        ],
        [
            17626.15234375
        ],
        ......
    ]
}


# Predict Power (Gesamt Deutschland)
Route:
/predict_power

Argumente:
keine

Sagt den Vorraussichtlichen Stromverbrauch, Residuallast und Pumpspeicher der AKTUELLEN WOCHE voraus
der Zeitraum erstreckt sich immer von Montag bis Sonntag der aktuellen Woche!
Es werden also ggf. auch Tage die bereits vergangen sind vorhergesagt.

Bsp.:
http://127.0.0.1:5002/predict_power

Response: JSON
Der INDEX ist im Unix timestamp in millisekunden angegeben!

{
    "columns": [
        "Power Usage",
        "Residuallast",
        "Pumpspeicher"
    ],
    "index": [
        1702854000000,
        1702857600000,
        .....
    ],
    "data": [
        [
            43748.23046875,
            20446.18359375,
            2877.9311523438
        ],
        [
            41793.65625,
            18962.79296875,
            3237.7707519531
        ],
        .......
    ]
}


# Predict Price (Gesamt Deutschland)
Route:
/predict_price

Argumente:
keine

Sagt ALLE DATEN für die aAKTUELLEN WOCHE voraus der Zeitraum erstreckt sich immer von Montag bis Sonntag der aktuellen Woche!
Es werden also ggf. auch Tage die bereits vergangen sind vorhergesagt.

Bsp.:
http://127.0.0.1:5002/predict_price

Response: JSON
Der INDEX ist im Unix timestamp in millisekunden angegeben!

{
    "columns": [
        "Power Usage",
        "Residuallast",
        "Pumpspeicher",
        "Wind Offshore",
        "Wind Onshore",
        "Photovoltaik",
        "Price"
    ],
    "index": [
        1702854000000,
        1702857600000,
        .....
    ],
    "data": [
        [
            43748.23046875,
            20446.18359375,
            2877.9311523438,
            3169.779296875,
            6743.3374023438,
            51.0119476318,
            35.3115501404
        ],
        [
            41793.65625,
            18962.79296875,
            3237.7707519531,
            3195.5095214844,
            8701.681640625,
            83.6519317627,
            35.9824028015
        ],
        ......
    ]
}


# Bsp:
http://127.0.0.1:5002/predict_photovoltaik?forecast_days=3&latitude=53.25046515527486&longitude=8.115672386637337&pWk=1
http://127.0.0.1:5002/predict_photovoltaik?forecast_days=3
http://127.0.0.1:5002/predict_on_shore?forecast_days=2
http://127.0.0.1:5002/predict_off_shore?forecast_days=7
http://127.0.0.1:5002/predict_price
http://127.0.0.1:5002/predict_power


