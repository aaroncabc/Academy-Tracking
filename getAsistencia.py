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


def obtener_lista(id_aula: int): 
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

def insert_asistencia_Aula(id_aula: int,asistencias: list,fecha):
    
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        
        for key in asistencias:
                nuevo_registro = {
                'id_std': key,
                'fecha': fecha,
                'asistio': asistencias[key],
                'id_aula': id_aula
                }
                last_id_result = session.execute(text("SELECT COALESCE(MAX(id_asis), 0) FROM asistencia"))
                last_id = last_id_result.scalar()  
                new_id = last_id + 1
                nuevo_registro["id_asis"] = new_id
                # Insertar el nuevo registro
                insert_stmt = asistencia_table.insert().values(nuevo_registro)
                session.execute(insert_stmt)
        session.commit()
        print("Registros insertados exitosamente en la tabla Asistencia.")
    except Exception as e:
        session.rollback()
        print(f"Error al insertar el registro: {e}")
    finally:
        session.close()
