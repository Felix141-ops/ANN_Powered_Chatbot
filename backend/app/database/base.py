#Allows us to create a base class for our ORM models
#All models will inherit from this base class
#Allows all models to share the same metadata

from sqlalchemy.orm import declarative_base

Base = declarative_base()
