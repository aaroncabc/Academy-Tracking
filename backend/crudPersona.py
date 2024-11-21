import psycopg2
from sqlalchemy import text
from config import get_connection

"""
CREATE TABLE Persona
(
    Id_persona            SERIAL PRIMARY KEY,
    Nombre                char(50) NOT NULL,
    Segundo_nombre        char(50) NULL,
    Apellido1             char(50) NOT NULL,
    Apellido2             char(50) NOT NULL,
    Tipo_identificacion   char(50) NOT NULL,
    Numero_documento      char(50) NOT NULL,
    Direccion             char(50) NOT NULL,
    Celular               char(50) NOT NULL,
    Cargo                 char(50) NOT NULL,
    Usuario               char(50) NOT NULL,
    Password              char(200) NOT NULL
);

"""
# Crear una persona
def create_persona(data):
    query = """
    INSERT INTO Persona (id_persona,Nombre, Segundo_nombre, Apellido1, Apellido2, Tipo_identificacion,
                         Numero_documento, Direccion, Celular, Cargo, Usuario, Pass_word)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING id_persona;
    """
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                last_id_result = cur.execute("SELECT COALESCE(MAX(id_persona), 0) FROM persona")
                last_id = cur.fetchone()[0] 
                new_id = last_id + 1
                data["id_persona"]= new_id
                cur.execute(query, (
                    data["id_persona"], data["Nombre"], data["Segundo_nombre"], 
                    data["Apellido1"], data["Apellido2"], data["Tipo_identificacion"],
                    data["Numero_documento"], data["Direccion"], data["Celular"],
                    data["Cargo"], data["Usuario"], data["Password"]
                ))
                id_persona = cur.fetchone()[0]
                print(f"Persona creada exitosamente con Id_persona: {id_persona}")
                return id_persona
    except Exception as e:
        print("Error al crear la persona:", e)
    finally:
        conn.close()

# Leer todas las personas
def read_all_personas():
    query = "SELECT id_persona,nombre FROM Persona;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query)
                lista_array = [{"id": row[0],"Nombre":row[1].strip()} for row in cur.fetchall()] 
                return lista_array
    except Exception as e:
        print("Error al leer las personas:", e)
    finally:
        conn.close()

# Leer una persona por Id_persona
def read_persona_by_id(id_persona):
    query = "SELECT * FROM Persona WHERE Id_persona = %s;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, (id_persona,))
                return cur.fetchone()
    except Exception as e:
        print("Error al leer la persona:", e)
    finally:
        conn.close()

# Actualizar una persona
def update_persona(id_persona, data):
    query = """
    UPDATE Persona
    SET Nombre = %s, Segundo_nombre = %s, Apellido1 = %s, Apellido2 = %s,
        Tipo_identificacion = %s, Numero_documento = %s, Direccion = %s,
        Celular = %s, Cargo = %s, Usuario = %s, Password = %s
    WHERE Id_persona = %s;
    """
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, data + (id_persona,))
                print("Persona actualizada exitosamente.")
    except Exception as e:
        print("Error al actualizar la persona:", e)
    finally:
        conn.close()

# Eliminar una persona
def delete_persona(id_persona):
    query = "DELETE FROM Persona WHERE Id_persona = %s;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, (id_persona,))
                print("Persona eliminada exitosamente.")
    except Exception as e:
        print("Error al eliminar la persona:", e)
    finally:
        conn.close()