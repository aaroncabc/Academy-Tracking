from sqlalchemy import create_engine,text

# Crear la conexión usando el driver `pg8000`
engine = create_engine("postgresql+pg8000://camilo_dlr:Camiloandres189_@localhost/flake")

# Realizar la consulta
with engine.connect() as conexion:
    result = conexion.execute(text("SELECT * FROM persona"))
    for row in result:
        print(row)

