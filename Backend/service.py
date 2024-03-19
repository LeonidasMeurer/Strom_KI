from flask import Flask, make_response, request, abort, jsonify, session
from flask_cors import cross_origin
from modelsAuth import db, User, Geraet
from flask_bcrypt import Bcrypt
from flask_session import Session
import os
from flask_cors import CORS
from config import ApplicationConfig
from flask_mail import Mail, Message



app = Flask(__name__)
#Konfigutaion 
app.config.from_object(ApplicationConfig)

#für die serverseitige Session-Authentifizierung
server_session=Session(app)

#damit das Passwort gehasht ist
bcrypt = Bcrypt(app)

#SQLite Datenbank
db.init_app(app)

cors =CORS(app,supports_credentials=True)

with app.app_context():
    db.create_all()

# Konfiguration für Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'contakt.frederik@gmail.com' 
app.config['MAIL_DEFAULT_SENDER'] = 'contakt.frederik@gmail.com' 
app.config['MAIL_PASSWORD'] = 'gdri phtz vzyg pydl'

# Initialisierung von Flask-Mail
mail = Mail(app)

#Test
@app.route("/test")
def test():   
    return "Frederick"


#Registrierung 
@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    pwk = request.json["pwk"]
    placeLat = request.json["placeLat"]
    placeLong = request.json["placeLong"]
    placeName = request.json["placeName"]


    #Es wird anhand der E-Mail geprüft, ob der Benutzer in der Datenbank vorhanden ist 
    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists: 
        return jsonify({"error": "Der Benutzer existiert schon"}), 409
    
    #Benutzer wird mit gehashten Password, E-Mail und Session erstellt
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, pwk=pwk, placeLat=placeLat, placeLong=placeLong, placeName=placeName)
    db.session.add(new_user)
    db.session.commit()
    session['user_id']=new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "pwk": new_user.pwk,
        "placeName": new_user.placeName,
        "placeLat": new_user.placeLat,
        "placeLong": new_user.placeLong
    })

#Login
@app.route("/login", methods=["POST"])
def User_Login():
    email = request.json["email"]
    password = request.json["password"]

    #Es wird geprüft, ob der Benutzer schon registriert ist
    user= User.query.filter_by(email=email).first()

    if user is None :
        return jsonify({'error': 'Unauthorized '}), 401
    
    #Passwort wird geprüft
    if not bcrypt.check_password_hash(user.password,password,):
        return jsonify({'error': 'Falsches Passwort '}), 401
    
    #Session wird eröffnet
    session['user_id']=user.id

    return jsonify({
        "id": user.id,
        "email": user.email,
        "pwk": user.pwk,
        "placeName": user.placeName,
         "placeLat": user.placeLat,
        "placeLong": user.placeLong,
        "Message": "you are Successfully Logged In"
    })

#Logout
@app.route("/logout",methods=["POST"])
def User_Logout():
    if 'user_id' in session:
        #Session wird geschlossen
        session.pop('user_id')
        return jsonify({'message': 'Logout erfolgreich.'}), 200
    else:
        return jsonify({'error': 'Es gab ein Problem beim Ausloggen'}), 500

#Kontakt
@app.route('/contact', methods=['POST'])
def contact():
    data = request.json
    name = data.get('name', '')
    sender_email = data.get('email', '')
    message_body = data.get('message', '')

    try:
        # Erstellen der E-Mail-Nachricht
        msg = Message("Kontaktanfrage von: " + name,
                      recipients=['contakt.frederik@gmail.com'])
        msg.body = f"Name: {name}\nE-Mail: {sender_email}\nNachricht: {message_body}"
        mail.send(msg)

        # Bestätigungs-E-Mail an den Benutzer senden
        confirm_msg = Message("Ihre Kontaktanfrage bei Frederik",
                      recipients=[sender_email])
        # HTML Body hinzufügen, um kursiven Text zu ermöglichen
        confirm_msg.html = (f"Vielen Dank für Ihre Anfrage.<br><br>"  # Zwei <br> für Leerzeile
                f"Hier ist eine Kopie Ihrer Nachricht:<br><br>"  # Zwei <br> für Leerzeile
                f"<em>\"{message_body}\"</em><br><br>"  # Zwei <br> für Leerzeile
                f"Wir werden uns so schnell wie möglich bei Ihnen melden.")
        mail.send(confirm_msg)

        return jsonify({'message': 'Ihre Nachricht wurde gesendet.'}), 200
    except Exception as e:
        # Protokollieren des Fehlers
        current_app.logger.error(f'Fehler beim Senden der E-Mail: {e}')

        # Rückgabe einer Fehlermeldung an den Client
        return jsonify({'error': 'Es gab ein Problem beim Senden der E-Mail'}), 500
#Gerät hinzufuegen
@app.route("/hinzufuegen", methods=["POST"])
def hinzufuegen():
    id = request.json["id"]
    name = request.json["name"]
    leistung = request.json["leistung"]
    anzahl = request.json["anzahl"]
    nutzungsdauer = request.json["nutzungsdauer"]
    #wenn Session userId = request.json["user_id"]
    newGeraet = Geraet(id=id, name=name, leistung=leistung, anzahl=anzahl, nutzungsdauer=nutzungsdauer)
    db.session.add(newGeraet)
    db.session.commit()

    return jsonify({
        "id": newGeraet.id,
        "name": newGeraet.name,
        "leistung": newGeraet.leistung,
        "anzahl": newGeraet.anzahl,
        "nutzungsdauer": newGeraet.nutzungsdauer
    })

#Gerät löschen
@app.route("/entfernen/<int:geraet_id>", methods=["DELETE"])
def loeschen(geraet_id):
    # Get the device by ID
    geraet = Geraet.query.get(geraet_id)

    if geraet:
        # Delete the device from the database
        db.session.delete(geraet)
        db.session.commit()

        return jsonify({"message": "Device deleted successfully"})
    else:
        return jsonify({"error": "Device not found"}), 404


@app.route("/geraete", methods=["GET"])
def alle_geraete():
    try:
        geraete = Geraet.query.all()

        if geraete:
            geraete_liste = [{
                "id": geraet.id,
                "name": geraet.name,
                "leistung": geraet.leistung,
                "anzahl": geraet.anzahl,
                "nutzungsdauer": geraet.nutzungsdauer,
            } for geraet in geraete]

            return jsonify({"geraete": geraete_liste})
        else:
            return jsonify({"message": "Keine Geräte gefunden"}), 404
    except Exception as e:
        print(f"Fehler beim Laden der Geräte: {str(e)}")
        return jsonify({"error": "Ein Fehler ist aufgetreten"}), 500
    
    
@app.route('/geraete', methods=['PUT'])
def update_geraete():
    data = request.json
    selected_id = data.get('id')
    new_anzahl = data.get('anzahl')

    if selected_id is None or new_anzahl is None:
        return jsonify({"error": "Invalid request"}), 400

    try:
        geraet = Geraet.query.get(selected_id)

        if geraet:
            geraet.anzahl = new_anzahl
            db.session.commit()

            return jsonify({"message": "Updated successfully"})
        else:
            return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        print(f"Fehler beim Aktualisieren des Geräts: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Ein Fehler ist aufgetreten"}), 500

if __name__ == "__main__":
    app.run()

    