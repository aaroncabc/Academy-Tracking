import psycopg2
from config import get_connection
"""
    CREATE TABLE Estudiantes
(
 Id_Std                  SERIAL int NOT NULL,
 Nombre                  char(50) NOT NULL,
 Segundo_nombre          char(50) NULL,
 apellido1               char(50) NOT NULL,
 apellido2               char(50) NOT NULL,
 Tipo_Identificacion     char(50) NOT NULL,  -- Cambié "Tipo_Identicficacion" a "Tipo_Identificacion"
 Numero_identificacion   char(50) NOT NULL,
 Genero                  char(50) NOT NULL,
 Estrato                 int NOT NULL,
 F_nacimiento            date NOT NULL,
 Id_Salon                int NOT NULL,
 CONSTRAINT PK_1 PRIMARY KEY ( Id_Std ),
 CONSTRAINT FK_1 FOREIGN KEY ( Id_Salon ) REFERENCES Aula ( Id_Aula )
);
"""

def create_estudiante(data):
    query = """
    INSERT INTO Estudiantes (Id_Std, Nombre, Segundo_nombre, Apellido1, Apellido2, Tipo_Identificacion,
                             Numero_identificacion, Genero, Estrato, F_nacimiento, Id_Salon)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING Id_Std;
    """
    conn = get_connection()  # Asegúrate de que esta función esté correctamente implementada
    try:
        with conn:
            with conn.cursor() as cur:
                # Obtener el último ID
                cur.execute("SELECT COALESCE(MAX(Id_Std), 0) FROM Estudiantes")
                last_id = cur.fetchone()[0]  # fetchone() devuelve una tupla
                new_id = last_id + 1
                
                # Agregar el nuevo ID al diccionario
                data["Id_Std"] = new_id
                
                # Ejecutar el query con parámetros
                cur.execute(query, (
                    data["Id_Std"], data["Nombre"], data["Segundo_nombre"], 
                    data["Apellido1"], data["Apellido2"], data["Tipo_Identificacion"],
                    data["Numero_identificacion"], data["Genero"], data["Estrato"], 
                    data["F_nacimiento"], data["Id_Salon"]
                ))
                
                # Obtener el ID retornado
                id_std = cur.fetchone()[0]
                print(f"Estudiante creado exitosamente con Id_Std: {id_std}")
                return id_std
    except Exception as e:
        print("Error al crear el estudiante:", e)
    finally:
        conn.close()

# Leer todos los estudiantes
def read_all_estudiantes():
    query = "SELECT * FROM Estudiantes;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query)
                return cur.fetchall()
    except Exception as e:
        print("Error al leer los estudiantes:", e)
    finally:
        conn.close()

# Leer un estudiante por Id_Std
def read_estudiante_by_id(id_std):
    query = "SELECT * FROM Estudiantes WHERE Id_Std = %s;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, (id_std,))
                return cur.fetchone()
    except Exception as e:
        print("Error al leer el estudiante:", e)
    finally:
        conn.close()

# Actualizar un estudiante
def update_estudiante(id_std, data):
    query = """
    UPDATE Estudiantes
    SET Nombre = %s, Segundo_nombre = %s, Apellido1 = %s, Apellido2 = %s,
        Tipo_Identificacion = %s, Numero_identificacion = %s, Genero = %s,
        Estrato = %s, F_nacimiento = %s, Id_Salon = %s
    WHERE Id_Std = %s;
    """
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, data + (id_std,))
                print("Estudiante actualizado exitosamente.")
    except Exception as e:
        print("Error al actualizar el estudiante:", e)
    finally:
        conn.close()

# Eliminar un estudiante
def delete_estudiante(id_std):
    query = "DELETE FROM Estudiantes WHERE Id_Std = %s;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, (id_std,))
                print("Estudiante eliminado exitosamente.")
    except Exception as e:
        print("Error al eliminar el estudiante:", e)
    finally:
        conn.close()
