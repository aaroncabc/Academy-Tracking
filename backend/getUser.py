from sqlalchemy import create_engine, Table, MetaData, Column, Integer, Date, Boolean, ForeignKey,text
from sqlalchemy.orm import sessionmaker
from datetime import date,datetime
# Información de conexión
db_params = {
    "host": "localhost",
    "database": "Flake",
    "user": "postgres",
    "password": "titajose23",
    "port": "5432"  # Puerto predeterminado de PostgreSQL
}



# Crear la cadena de conexión
connection_string = f"postgresql+psycopg2://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['database']}"

# Crear el motor de conexión
engine = create_engine(connection_string)


# Función para obtener aulas de un tutor
def obtener_usuario(usuario:str): 
    Session = sessionmaker(bind=engine)
    session = Session()
    lista_array = []  # Inicializar lista_array antes del bloque try

    try:
        lista = session.execute(text("SELECT usuario,password,rol FROM usuario WHERE usuario = :usuario "), {"usuario":usuario})
        lista_array = [{"usuario": row[0],"password":row[1],"rol":row[2]} for row in lista.fetchall()]  # _allrows() en lugar de acceder a `_allrows` directamente
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
        lista = session.execute(text("SELECT rol FROM usuario WHERE usuario = :usuario "), {"usuario":usuario})
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