from sqlalchemy import create_engine, Table, MetaData, Column, Integer, Date, Boolean, ForeignKey,text
from sqlalchemy.orm import sessionmaker
from datetime import date,datetime
import config

# Crear la cadena de conexión
connection_string = config.SQLALCHEMY_DATABASE_URI
# Crear el motor de conexión
engine = create_engine(connection_string)

# Función para obtener TODAS las aulas 
def obtener_aulas(): 
    Session = sessionmaker(bind=engine)
    session = Session()
    lista_array = []  # Inicializar lista_array antes del bloque try

    try:
        lista = session.execute(text("SELECT  aula.grupo,aula.grado,aula.gradot,institucion.nombre, aula.id_aula FROM aula INNER JOIN institucion ON (aula.id_institucion = institucion.id_institucion) "), {})
        lista_array = [{"grupo": row[0],"grado":row[1],"gradot":row[2],"institucion":row[3],"id_aula":row[4]} for row in lista.fetchall()]  # _allrows() en lugar de acceder a `_allrows` directamente
        session.commit()
        print("Registros obtenidos exitosamente en la tabla aula.")
    except Exception as e:
        session.rollback()
        print(f"Error al obtener registros: {e}")
    finally:
        session.close()
        
    return lista_array  # Retornar lista_array fuera del finally

def Crear_aula(grupo:int,grupoT:str,jornada:str,grado:int,gradoT:str,id_persona:int,id_institucion:int):
    last_id_result = session.execute(text("SELECT COALESCE(MAX(id_aula), 0) FROM aula"))
    last_id = last_id_result.scalar()  
    id_aula= last_id + 1
    grado_dict={"Primero":1,"Segundo":2,"Tercero":3,"Cuarto":4,"Quinto":5}
    
    Session = sessionmaker(bind=engine)
    session = Session()
    lista = session.execute(text("SELECT * FROM aula"))

    
    if any(x.isdigit() for x in [grupoT, jornada, gradoT]): #valida si los valores str tienen algun valor numerico
        return {"error": "Los campos GrupoT, Jornada y GradoT no deben contener dígitos."}

    if any(map((lambda x: not isinstance(x,int),[id_aula,grado,gradoT,id_persona,id_institucion]))): #valida si los valores int no poseen ningun campo diferente a un número
        return {"error": "Los campos id_aula, grado, id_persona e id_institucion deben ser números enteros."}

    if str(grupo)[0] != str(grado): #valida si el primer valor referente al grupo que es el grado es igual al grado
        return {"error": "El primer dígito de grupo debe coincidir con el grado."}
    else:
        for i in lista: #valida si el grupo colocado o el id_aula ya existen
            if  i[1] == grupo:
                return {"error": "grupo ya existen en la base de datos."}

    if grado_dict[gradoT] != grado: #valida si el grado colocado corresponde al numero del grado
        return {"error": "El valor de GradoT no coincide con el número del grado."}
    
    dict_={'Id_aula':id_aula,'Grupo':grupo,'GrupoT':grupoT,'Jornada':jornada,'Grado':grado,'GradoT':gradoT,'Id_persona':id_persona,'Id_institucion':id_institucion}
    session.execute("INSERT INTO aula (Id_Aula, Grupo, GrupoT, Jornada, Grado, GradoT, Id_persona, Id_institucion) VALUES (:Id_Aula,:Grupo,:GrupoT,Jornada,Grado,GradoT,Id_persona,Id_institucion)",dict_)
    session.commit()

    return True