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

##ready
# Función para obtener aulas de un tutor
def obtener_aulas_tutor(id_tutor: int): 
    Session = sessionmaker(bind=engine)
    session = Session()
    lista_array = []  # Inicializar lista_array antes del bloque try

    try:
        lista = session.execute(text("SELECT aula.grupo,aula.grado,aula.gradot,institucion.nombre FROM aula INNER JOIN institucion ON (aula.id_institucion = institucion.id_institucion) WHERE id_persona = :id_tutor"), {"id_tutor": id_tutor})
        lista_array = [{"grupo": row[0],"grado":row[1],"gradot":row[2],"institucion":row[3]} for row in lista.fetchall()]  # _allrows() en lugar de acceder a `_allrows` directamente
        session.commit()
        print("Registros obtenidos exitosamente en la tabla aula.")
    except Exception as e:
        session.rollback()
        print(f"Error al obtener registros: {e}")
    finally:
        session.close()
        
    return lista_array  # Retornar lista_array fuera del finally

##ready
# Función para obtener la lista de alumnos de un aula
def obtener_lista_Alumnos(id_aula: int): 
    Session = sessionmaker(bind=engine)
    session = Session()
    lista_array = []
    try:
        lista = session.execute(text(f"SELECT id_std FROM estudiantes WHERE id_salon = {id_aula}"))
        lista_array = [{"id_std": row[0]} for row in lista.fetchall()]
        session.commit()
        print("Registros obtenidos exitosamente en la tabla estudiantes.")
    except Exception as e:
        session.rollback()
        print(f"Error al obtener registros: {e}")
    finally:
        session.close()
        return lista_array



##ready
#Funcion para obtener aulas que tienen clase hoy segun tutor
def obtener_aulas_del_dia_byTutor(id_tutor: int):
    Session = sessionmaker(bind=engine)
    session = Session()
    days = {"1":"Lunes","2":"Martes","3":"Miercoles","4":"Jueves","5":"Viernes","6":"Sabado","7":"Domingo"}
    lista_array = []
    # Obtener la fecha actual
    fecha_actual = datetime.now()

    # Extraer el día
    dia_actual = fecha_actual.isoweekday()
    try:
                # Ejecuta la consulta con parámetros
        query = text("SELECT horario.id_aula, horario.hora_i, horario.hora_f FROM horario INNER JOIN aula ON (horario.id_aula = aula.id_aula) WHERE aula.id_persona = :id_tutor AND horario.dia_text = :dia_text")
        lista = session.execute(query, {"id_tutor": id_tutor, "dia_text": str(days[str(dia_actual)])})
        lista_array =  [{"id_aula": row.id_aula, "hora_i": str(row.hora_i), "hora_f": str(row.hora_f)} for row in lista.fetchall()]
        session.commit()
        print("Registros obtenidos exitosamente en la tabla aula.")
    except Exception as e:
        session.rollback()
        print(f"Error al obtener registros: {e}")
    finally:
        session.close()
        return lista_array
    
