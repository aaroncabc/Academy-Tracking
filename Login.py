from sqlalchemy import create_engine,text

# Crear la conexión usando el driver `pg8000`
engine = create_engine("postgresql+pg8000://camilo_dlr:Camiloandres189_@localhost/flake")

with engine.connect() as conexion:
            list_tuple_id = conexion.execute(text("SELECT * FROM persona WHERE cargo = 'Administrador' "))
            for i in list_tuple_id:
                 print(i)
            

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

def Create_Account(First_name: str, Second_name: str, First_lastname: str, Second_lastname: str, Id_Type: str, Identification: str, Address: str, Type_person: str, Cellphone:str) -> bool:
    with engine.connect() as conexion:

        if any(map(str.isdigit, [First_name, Second_name, First_lastname, Second_lastname, Id_Type, Type_person])) or Identification.isalpha() or Cellphone.isalpha():
            return False 

        if any(map(lambda x: x.strip() == '', [First_name, Second_name, First_lastname, Second_lastname, Id_Type, Type_person, Address,Identification])):
            return False
        
        if Type_person == "Administrador":
            result = conexion.execute(text("SELECT COUNT(*) FROM persona WHERE cargo = 'Administrador'"))
            admin_count = result.scalar()  
            if admin_count > 0:
                return False  

       
        Full_name = f"{First_name}{Second_name}{First_lastname}{Second_lastname}"
        query = text("SELECT COUNT(*) FROM persona WHERE CONCAT(nombre, segundo_nombre, apellido1, apellido2) = :full_name AND numero_documento = :identification")
        result = conexion.execute(query, {"full_name": Full_name, "identification": Identification})
        user_count = result.scalar()
        
        if user_count > 0:
            return False  

        last_id_result = conexion.execute(text("SELECT COALESCE(MAX(Id_persona), 0) FROM Persona"))
        last_id = last_id_result.scalar()  

        new_id = last_id + 1

        query = text("INSERT INTO Persona (Id_persona, Nombre, Segundo_nombre, Apellido1, Apellido2, Tipo_identificacion, Numero_documento, Direccion, Celular, Cargo) VALUES (:id_persona, :first_name, :second_name, :first_lastname, :second_lastname, :id_type, :identification, :address, :cell, :type_person)")
        conexion.execute(query, {
            "id_persona": new_id,
            "first_name": First_name,
            "second_name": Second_name,
            "first_lastname": First_lastname,
            "second_lastname": Second_lastname,
            "id_type": Id_Type,
            "identification": Identification,
            "address": Address,
            "cell": Cellphone,
            "type_person": Type_person
        })

        return True




                     



        



