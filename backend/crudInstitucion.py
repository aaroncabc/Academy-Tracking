import psycopg2
from config import get_connection

"""
CREATE TABLE Institucion
(
    Id_institucion SERIAL PRIMARY KEY,
    Codigo         char(50) NOT NULL,
    Nombre         char(50) NOT NULL,
    Rector         char(50) NOT NULL,
    Localidad      char(50) NOT NULL,
    Barrio         char(50) NOT NULL,
    Direccion      char(50) NOT NULL
);
"""

# Crear una institución
def create_institucion(data):
    query = """
    INSERT INTO Institucion (Codigo, Nombre, Rector, Localidad, Barrio, Direccion)
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING Id_institucion;
    """
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, data)
                id_institucion = cur.fetchone()[0]
                print(f"Institución creada exitosamente con Id_institucion: {id_institucion}")
                return id_institucion
    except Exception as e:
        print("Error al crear la institución:", e)
    finally:
        conn.close()

# Leer todas las instituciones
def read_all_instituciones():
    query = "SELECT id_institucion,nombre FROM Institucion;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query)
                lista_array = [{"id": row[0],"Nombre":row[1].strip()} for row in cur.fetchall()]
                return lista_array
    except Exception as e:
        print("Error al leer las instituciones:", e)
    finally:
        conn.close()

# Leer una institución por Id_institucion
def read_institucion_by_id(id_institucion):
    query = "SELECT * FROM Institucion WHERE Id_institucion = %s;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, (id_institucion,))
                return cur.fetchone()
    except Exception as e:
        print("Error al leer la institución:", e)
    finally:
        conn.close()

# Actualizar una institución
def update_institucion(id_institucion, data):
    query = """
    UPDATE Institucion
    SET Codigo = %s, Nombre = %s, Rector = %s, Localidad = %s, Barrio = %s, Direccion = %s
    WHERE Id_institucion = %s;
    """
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, data + (id_institucion,))
                print("Institución actualizada exitosamente.")
    except Exception as e:
        print("Error al actualizar la institución:", e)
    finally:
        conn.close()

# Eliminar una institución
def delete_institucion(id_institucion):
    query = "DELETE FROM Institucion WHERE Id_institucion = %s;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, (id_institucion,))
                print("Institución eliminada exitosamente.")
    except Exception as e:
        print("Error al eliminar la institución:", e)
    finally:
        conn.close()
