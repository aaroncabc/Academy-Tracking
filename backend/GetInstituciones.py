from sqlalchemy import create_engine, Table, MetaData, Column, Integer, Date, Boolean, ForeignKey,text
from sqlalchemy.orm import sessionmaker
from datetime import date,datetime

import config

# Crear la cadena de conexión
connection_string = config.SQLALCHEMY_DATABASE_URI

# Crear el motor de conexión
engine = create_engine(connection_string)

def obtener_escuelas(): 
    Session = sessionmaker(bind=engine)
    session = Session()
    lista_array = []  # Inicializar lista_array antes del bloque try

    try:
        lista = session.execute(text("SELECT institucion.id_institucion,institucion.nombre FROM institucion "), {})
        lista_array = [{"id_instituciones": row[0],"nombre":row[1]} for row in lista.fetchall()]  # _allrows() en lugar de acceder a `_allrows` directamente
        session.commit()
        print("Registros obtenidos exitosamente en la tabla aula.")
    except Exception as e:
        session.rollback()
        print(f"Error al obtener registros: {e}")
    finally:
        session.close()
        
    return lista_array  # Retornar lista_array fuera del finally