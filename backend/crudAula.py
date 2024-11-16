import psycopg2
from app import get_connection
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
    INSERT INTO Aula (Grupo, GrupoT, Jornada, Grado, GradoT, Id_persona, Id_institucion, Año)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING Id_Aula;
    """
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, data)
                id_aula = cur.fetchone()[0]
                print(f"Aula creada exitosamente con Id_Aula: {id_aula}")
                return id_aula
    except Exception as e:
        print("Error al crear el aula:", e)
    finally:
        conn.close()

# Leer registros (todos)
def read_all_aulas():
    query = "SELECT * FROM Aula;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query)
                return cur.fetchall()
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
