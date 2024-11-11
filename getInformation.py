from sqlalchemy import create_engine, Table, MetaData, Column, Integer, Date, Boolean, ForeignKey,text
from sqlalchemy.orm import sessionmaker
from datetime import date

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


# Crear metadatos y definir la tabla de Asistencia
metadata = MetaData()
asistencia_table = Table(
    'asistencia', metadata,
    Column('id_asis', Integer, primary_key=True),
    Column('id_std', Integer, ForeignKey('estudiantes.id_std'), nullable=False),
    Column('fecha', Date, nullable=False),
    Column('asistio', Boolean, nullable=False),
    Column('id_aula', Integer, ForeignKey('aula.id_aula'), nullable=False)
)


# Funcion para obtener aulas de un tutor
def obtener_aulas_tutor(id_tutor: int): 
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        lista = session.execute(text(f"SELECT id_aula FROM aula WHERE id_tutor = {id_tutor}"))
        lista_array = lista._allrows
        session.commit()
        print("Registros obtenidos exitosamente en la tabla aula.")
    except Exception as e:
        session.rollback()
        print(f"Error al obtener registros: {e}")
    finally:
        session.close()
        return lista_array

# Función para obtener la lista de alumnos de un aula
def obtener_lista_Alumnos(id_aula: int): 
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        lista = session.execute(text(f"SELECT id_std FROM estudiantes WHERE id_salon = {id_aula}"))
        lista_array = lista._allrows
        session.commit()
        print("Registros obtenidos exitosamente en la tabla estudiantes.")
    except Exception as e:
        session.rollback()
        print(f"Error al obtener registros: {e}")
    finally:
        session.close()
        return lista_array
