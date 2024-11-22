import datetime
from sqlalchemy import create_engine, Table, MetaData, Column, Integer, Date, Boolean, ForeignKey,text
from sqlalchemy.orm import sessionmaker
from datetime import date,datetime
import config

# Crear la cadena de conexión
connection_string = config.SQLALCHEMY_DATABASE_URI
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

asistenciatutor_table = Table(
    'asistenciatutor', metadata,
    Column('id_at', Integer, primary_key=True),
    Column('fecha', Date, nullable=False),
    Column('asistio', Boolean, nullable=False),
    Column('id_aula', Integer, ForeignKey('aula.id_aula'), nullable=False)
)
# Función para insertar datos en Asistencia (Alumnos)
def insertar_asistencia_Alumno(id_std: int, fecha: date, asistio: bool, id_aula: int):
    Session = sessionmaker(bind=engine)
    session = Session()
    nuevo_registro = {
        'id_std': id_std,
        'fecha': fecha,
        'asistio': asistio,
        'id_aula': id_aula
    }
    try:
        last_id_result = session.execute(text("SELECT COALESCE(MAX(id_asis), 0) FROM asistencia"))
        last_id = last_id_result.scalar()
        new_id = last_id + 1
        nuevo_registro["id_asis"] = new_id
        insert_stmt = asistencia_table.insert().values(nuevo_registro)
        session.execute(insert_stmt)
        session.commit()
        print("Registro insertado exitosamente en la tabla Asistencia.")
    except Exception as e:
        session.rollback()
        print(f"Error al insertar el registro de asistencia del alumno: {e}")
    finally:
        session.close()

# Función para insertar datos en AsistenciaTutor
def insertar_asistencia_Tutor(fecha: date, asistio: bool, id_aula: int):
    Session = sessionmaker(bind=engine)
    session = Session()
    nuevo_registro = {
        'fecha': fecha,
        'asistio': asistio,
        'id_aula': id_aula
    }
    try:
        last_id_result = session.execute(text("SELECT COALESCE(MAX(id_at), 0) FROM asistenciatutor"))
        last_id = last_id_result.scalar()
        new_id = last_id + 1
        nuevo_registro["id_at"] = new_id  # Corregido el campo de la tabla
        insert_stmt = asistenciatutor_table.insert().values(nuevo_registro)
        session.execute(insert_stmt)
        session.commit()
        print("Registro insertado exitosamente en la tabla AsistenciaTutor.")
    except Exception as e:
        session.rollback()
        print(f"Error al insertar el registro de asistencia del tutor: {e}")
    finally:
        session.close()

# Función para insertar asistencia de un aula
def insert_asistencia_Aula(id_aula: int, asistencias: list, fecha: date):
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        query = text("SELECT * FROM asistencia WHERE fecha = :fecha AND id_aula = :id_aula")
        resultado = session.execute(query, {"fecha": fecha, "id_aula": id_aula}).fetchone()
        if resultado:
            print("La asistencia ya fue tomada para esta fecha y aula.")
            return {"message": "Asistencia ya tomada"}

        # Insertar asistencia del tutor
        insertar_asistencia_Tutor(fecha, True, id_aula)

        # Insertar asistencia de alumnos
        for asistencia in asistencias:
            asistio = asistencia.get('asistencia', False) in [True, "true", 1]
            id_std = asistencia.get('id_std')
            insertar_asistencia_Alumno(id_std, fecha, asistio, id_aula)

        session.commit()
        print("Asistencias insertadas exitosamente.")
    except Exception as e:
        session.rollback()
        print(f"Error al insertar asistencias del aula: {e}")
    finally:
        session.close()
    return {"message": "Asistencias tomadas exitosamente"}
