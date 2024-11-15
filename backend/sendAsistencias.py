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

# Función para insertar datos en Asistencia
def insertar_asistencia_Alumno(id_std: int, fecha: date, asistio: bool, id_aula: int):
    # Crear una sesión
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
        # Insertar el nuevo registro
        insert_stmt = asistencia_table.insert().values(nuevo_registro)
        session.execute(insert_stmt)
        session.commit()
        print("Registro insertado exitosamente en la tabla Asistencia.")
    except Exception as e:
        session.rollback()
        print(f"Error al insertar el registro: {e}")
    finally:
        session.close()
        return

def insertar_asistencia_Tutor(fecha: date, asistio: bool, id_aula: int):
    # Crear una sesión
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
        nuevo_registro["id_asis"] = new_id
        # Insertar el nuevo registro
        insert_stmt = asistenciatutor_table.insert().values(nuevo_registro)
        session.execute(insert_stmt)
        session.commit()
        print("Registro insertado exitosamente en la tabla Asistencia.")
    except Exception as e:
        session.rollback()
        print(f"Error al insertar el registro: {e}")
    finally:
        session.close()
        return


# Función para insertar asistencia de un aula
def insert_asistencia_Aula(id_aula: int,asistencias: list,date,atutor):
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        fecha_actual = datetime.now()
        fecha_actual = fecha_actual.strftime("%Y-%m-%d")
        query =text("SELECT * FROM asistencia WHERE fecha = :fecha_actual AND id_aula = :id_aula")
        tomado = session.execute(query,{"fecha_actual":fecha_actual,"id_aula":id_aula})
        if(tomado):
            return
        insertar_asistencia_Tutor(date,True,id_aula)
        for asistencia in asistencias:
            nuevo_registro = {
                'id_std': asistencia['nombre'],
                'fecha': date,
                'asistio': asistencia['asistencia'],
                'id_aula': id_aula
            }
            if(nuevo_registro["asistio"] == "true"):
                nuevo_registro["asistio"]= True
            else:
                nuevo_registro["asistio"]=False
            last_id_result = session.execute(text("SELECT COALESCE(MAX(id_asis), 0) FROM asistencia"))
            last_id = last_id_result.scalar()  
            new_id = last_id + 1
            nuevo_registro["id_asis"] = new_id
            insertar_asistencia_Alumno(nuevo_registro['id_std'], date, nuevo_registro['asistio'], id_aula)
        session.commit()
        print("Registros insertados exitosamente en la tabla Asistencia.")
    except Exception as e:
        session.rollback()
        print(f"Error al insertar el registro: {e}")
    finally:
        session.close()
        return "Asistencia tomada exitosamente"

