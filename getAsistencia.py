from sqlalchemy import create_engine, Table, MetaData, Column, Integer, Date, Boolean, ForeignKey
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

# Crear una sesión
Session = sessionmaker(bind=engine)
session = Session()

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
def insertar_asistencia(id_std: int, fecha: date, asistio: bool, id_aula: int):
    nuevo_registro = {
        "id_asis":10,
        'id_std': id_std,
        'fecha': fecha,
        'asistio': asistio,
        'id_aula': id_aula
    }
    
    try:
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


insertar_asistencia(1,'2024-02-05',True,1)