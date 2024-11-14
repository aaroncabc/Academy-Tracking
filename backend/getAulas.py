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
def obtener_aulas(): 
    Session = sessionmaker(bind=engine)
    session = Session()
    lista_array = []  # Inicializar lista_array antes del bloque try

    try:
        lista = session.execute(text("SELECT  aula.grupo,aula.grado,aula.gradot,institucion.nombre, aula.id_aula FROM aula INNER JOIN institucion ON (aula.id_institucion = institucion.id_institucion) "), {})
        lista_array = [{"grupo": row[0],"grado":row[1],"gradot":row[2],"institucion":row[3],"id_aula":row[4]} for row in lista.fetchall()]  # _allrows() en lugar de acceder a `_allrows` directamente
        session.commit()
        print("Registros obtenidos exitosamente en la tabla aula.")
    except Exception as e:
        session.rollback()
        print(f"Error al obtener registros: {e}")
    finally:
        session.close()
        
    return lista_array  # Retornar lista_array fuera del finally