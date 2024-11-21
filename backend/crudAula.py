from datetime import datetime,date
import psycopg2
from config import get_connection
"""
CREATE TABLE Aula
(
    Id_Aula        SERIAL PRIMARY KEY,
    Grupo          int NOT NULL,
    GrupoT         char(50) NULL,
    Jornada        char(50) NOT NULL,
    Grado          int NOT NULL,
    GradoT         char(50) NOT NULL,
    Id_persona     int NOT NULL,
    Id_institucion int NOT NULL,
    Año            int NOT NULL,
    CONSTRAINT FK_9 FOREIGN KEY (Id_persona) REFERENCES Persona (Id_persona),
    CONSTRAINT FK_10 FOREIGN KEY (Id_institucion) REFERENCES Institucion (Id_institucion)
);
"""


# Crear un registro (Id_Aula autoincremental)
def create_aula(data):
    query = """
    INSERT INTO Aula (Id_Aula, Grupo, GrupoT, Jornada, Grado, GradoT, Id_persona, Id_institucion, Año)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING Id_Aula;
    """
    conn = get_connection()  # Asegúrate de que esta función esté correctamente implementada
    try:
        with conn:
            with conn.cursor() as cur:
                # Obtener el último ID
                cur.execute("SELECT COALESCE(MAX(Id_Aula), 0) FROM Aula")
                last_id = cur.fetchone()[0]  # fetchone() devuelve una tupla
                new_id = last_id + 1
                
                # Agregar el nuevo ID al diccionario
                data["Id_Aula"] = new_id
                
                # Ejecutar el query con parámetros
                cur.execute(query, (
                    data["Id_Aula"], data["Grupo"], data["GrupoT"], data["Jornada"], 
                    data["Grado"], data["GradoT"], data["Id_persona"], 
                    data["Id_institucion"], data["Año"]
                ))
                
                # Obtener el ID retornado
                id_aula = cur.fetchone()[0]
                print(f"Aula creada exitosamente con Id_Aula: {id_aula}")
                return id_aula
    except Exception as e:
        print("Error al crear el aula:", e)
    finally:
        conn.close()


# Leer registros (todos)
def read_all_aulas():
    año_actual = datetime.now().year
    query = f"SELECT id_aula,grupo,grupoT,gradoT,Nombre,año FROM Aula INNER JOIN institucion on(aula.id_institucion = institucion.id_institucion) WHERE año = {año_actual};"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query)
                return [{"id": row[0],"grupo":row[1],"grupoT":row[2].strip(),"grado":row[3],"institucion":row[4]} for row in cur.fetchall()]
    except Exception as e:
        print("Error al leer las aulas:", e)
    finally:
        conn.close()

# Leer un registro por Id_Aula
def read_aula_by_id(id_aula):
    query = "SELECT * FROM Aula WHERE Id_Aula = %s;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, (id_aula,))
                return cur.fetchone()
    except Exception as e:
        print("Error al leer el aula:", e)
    finally:
        conn.close()

# Actualizar un registro
def update_aula(id_aula, data):
    query = """
    UPDATE Aula
    SET Grupo = %s, GrupoT = %s, Jornada = %s, Grado = %s, GradoT = %s, 
        Id_persona = %s, Id_institucion = %s, Año = %s
    WHERE Id_Aula = %s;
    """
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, data + (id_aula,))
                print("Aula actualizada exitosamente.")
    except Exception as e:
        print("Error al actualizar el aula:", e)
    finally:
        conn.close()

# Eliminar un registro
def delete_aula(id_aula):
    query = "DELETE FROM Aula WHERE Id_Aula = %s;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, (id_aula,))
                print("Aula eliminada exitosamente.")
    except Exception as e:
        print("Error al eliminar el aula:", e)
    finally:
        conn.close()
