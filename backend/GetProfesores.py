from sqlalchemy import create_engine, Table, MetaData, Column, Integer, Date, Boolean, ForeignKey,text
from sqlalchemy.orm import sessionmaker
from datetime import date,datetime
# Información de conexión
db_params = {
    "host": "localhost",
    "database": "Flake",
    "user": "Brayan",
    "password": "07072004",
    "port": "5432"  # Puerto predeterminado de PostgreSQL
}



# Crear la cadena de conexión
connection_string = f"postgresql+psycopg2://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['database']}"

# Crear el motor de conexión
engine = create_engine(connection_string)

# Función para obtener TODAS las aulas 
def obtener_profesores(): 
    Session = sessionmaker(bind=engine)
    session = Session()
    lista_array = []  # Inicializar lista_array antes del bloque try

    try:
        lista = session.execute(text("SELECT id_persona,nombre,Tipo_identificacion,numero_documento,celular,direccion FROM persona"), {})
        lista_array = [{"id": row[0],"nombre":row[1],"identificacion":row[2],"numero":row[3],"celular":row[4],"direccion":row[5]} for row in lista.fetchall()]  # _allrows() en lugar de acceder a `_allrows` directamente
        session.commit()
        print("Registros obtenidos exitosamente en la tabla persona.")
    except Exception as e:
        session.rollback()
        print(f"Error al obtener registros: {e}")
    finally:
        session.close()
        
    return lista_array  # Retornar lista_array fuera del finally