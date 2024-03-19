import flask_sqlalchemy 
from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4


db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.String(32), primary_key=True, unique=True,  default=get_uuid)
    email = db.Column(db.String(300), unique=True, nullable=False)
    password = db.Column(db.String(300), nullable=False)
    pwk = db.Column(db.Float)
    placeLat = db.Column(db.Float)
    placeLong = db.Column(db.Float)
    placeName = db.Column(db.String(600))


class Geraet(db.Model):
    __tablename__ = "geraet"
    id = db.Column(db.Integer(), primary_key=True, unique=True,  default=get_uuid)
    name = db.Column(db.String(300), nullable=False)
    leistung = db.Column(db.Integer(), nullable=False)
    anzahl = db.Column(db.Integer(), nullable=False)
    nutzungsdauer = db.Column(db.Integer(), nullable=False)
