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

def obtener_aulas_del_dia_byTutor(id_tutor: int):
    Session = sessionmaker(bind=engine)
    session = Session()
    days = {"1":"lunes","2":"martes","3":"miercoles","4":"jueves","5":"viernes","6":"sabado","7":"domingo"}
    # Obtener la fecha actual
    fecha_actual = datetime.now()

    # Extraer el día
    dia_actual = fecha_actual.isoweekday()
    try:
        lista = session.execute(text(f"SELECT id_aula, hora_i, hora_f FROM horario INNER JOIN aula on(horario.id_aula = aula.id_aula) WHERE aula.id_persona = {id_tutor} AND horario.dia_text = '{days[str(dia_actual)]}'"))
        lista_array = lista._allrows
        session.commit()
        print("Registros obtenidos exitosamente en la tabla aula.")
    except Exception as e:
        session.rollback()
        print(f"Error al obtener registros: {e}")
    finally:
        session.close()
        return lista_array
    
