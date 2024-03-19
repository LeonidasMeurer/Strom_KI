import os
import redis
from dotenv import load_dotenv
load_dotenv()



class ApplicationConfig:
    


    basedir = os.path.abspath(os.path.dirname(__file__))

    SECRET_KEY = os.environ["SECRET_KEY"]

    SQLALCHEMY_DATABASE_URI ='sqlite:///' + os.path.join(basedir, 'database.sqlite')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    SESSION_TYPE = 'redis'
    SESSION_PERMANENT = False
    #SESSION_USE_SIGNER = True wegen TypeError: cannot use a string pattern on a bytes-like object wird ist dies noch nicht möglich
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")
