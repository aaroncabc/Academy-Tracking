from sqlalchemy import create_engine, Table, MetaData, Column, Integer, Date, Boolean, ForeignKey,text
from sqlalchemy.orm import sessionmaker
from datetime import date,datetime
import config

# Crear la cadena de conexión
connection_string = config.SQLALCHEMY_DATABASE_URI
# Crear el motor de conexión
engine = create_engine(connection_string)


# Función para obtener aulas de un tutor
def obtener_usuario(usuario:str): 
    Session = sessionmaker(bind=engine)
    session = Session()
    lista_array = []  # Inicializar lista_array antes del bloque try

    try:
        lista = session.execute(text("SELECT id_persona, usuario,password,cargo FROM persona WHERE usuario = :usuario "), {"usuario":usuario})
        lista_array = [{"id_persona":row[0],"usuario": row[1],"password":row[2],"rol":row[3]} for row in lista.fetchall()]  # _allrows() en lugar de acceder a `_allrows` directamente
        session.commit()
        print("Registros obtenidos exitosamente en la tabla aula.")
    except Exception as e:
        session.rollback()
        print(f"Error al obtener registros: {e}")
    finally:
        session.close()
        
    return lista_array  # Retornar lista_array fuera del finally{
        
def obtener_rol(usuario:str):
    Session = sessionmaker(bind=engine)
    session = Session()
    lista_array = []  # Inicializar lista_array antes del bloque try

    try:
        lista = session.execute(text("SELECT cargo FROM persona WHERE usuario = :usuario "), {"usuario":usuario})
        lista_array = [{"rol":row[0]} for row in lista.fetchall()]  # _allrows() en lugar de acceder a `_allrows` directamente
        print(lista_array)
        session.commit()
        print("Registros obtenidos exitosamente en la tabla aula.")
    except Exception as e:
        session.rollback()
        print(f"Error al obtener registros: {e}")
    finally:
        session.close()
        
    return lista_array  # Retornar lista_array fuera del finally{