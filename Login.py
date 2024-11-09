from sqlalchemy import create_engine,text

# Crear la conexión usando el driver `pg8000`
engine = create_engine("postgresql+pg8000://camilo_dlr:Camiloandres189_@localhost/flake")

def Login(identification:str)->bool:

    if identification.isdigit():
        with engine.connect() as conexion:
            list_tuple_id = conexion.execute(text("SELECT numero_documento FROM persona"))
            for id in list_tuple_id:
                if identification == id.strip():
                    return True
            return False
    else:
        return False

    pass   

