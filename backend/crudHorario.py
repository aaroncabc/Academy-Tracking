import psycopg2
from app import get_connection
"""
CREATE TABLE Horario
(
    Id_H               SERIAL PRIMARY KEY,
    Hora_i             time NOT NULL,
    Hora_f             time NOT NULL,
    Dia_I              char(1) NOT NULL,
    Dia_text           char(50) NOT NULL,
    Id_Bloque_electivo int NOT NULL,
    Id_Aula            int NOT NULL,
    CONSTRAINT FK_7 FOREIGN KEY (Id_Bloque_electivo) REFERENCES Año_electivo (Id_Bloque_electivo),
    CONSTRAINT FK_8 FOREIGN KEY (Id_Aula) REFERENCES Aula (Id_Aula)
);
"""

# Crear un horario
def create_horario(data):
    query = """
    INSERT INTO Horario (Hora_i, Hora_f, Dia_I, Dia_text, Id_Bloque_electivo, Id_Aula)
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING Id_H;
    """
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, data)
                id_h = cur.fetchone()[0]
                print(f"Horario creado exitosamente con Id_H: {id_h}")
                return id_h
    except Exception as e:
        print("Error al crear el horario:", e)
    finally:
        conn.close()

# Leer todos los horarios
def read_all_horarios():
    query = "SELECT * FROM Horario;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query)
                return cur.fetchall()
    except Exception as e:
        print("Error al leer los horarios:", e)
    finally:
        conn.close()

# Leer un horario por Id_H
def read_horario_by_id(id_h):
    query = "SELECT * FROM Horario WHERE Id_H = %s;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, (id_h,))
                return cur.fetchone()
    except Exception as e:
        print("Error al leer el horario:", e)
    finally:
        conn.close()

# Actualizar un horario
def update_horario(id_h, data):
    query = """
    UPDATE Horario
    SET Hora_i = %s, Hora_f = %s, Dia_I = %s, Dia_text = %s, Id_Bloque_electivo = %s, Id_Aula = %s
    WHERE Id_H = %s;
    """
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, data + (id_h,))
                print("Horario actualizado exitosamente.")
    except Exception as e:
        print("Error al actualizar el horario:", e)
    finally:
        conn.close()

# Eliminar un horario
def delete_horario(id_h):
    query = "DELETE FROM Horario WHERE Id_H = %s;"
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(query, (id_h,))
                print("Horario eliminado exitosamente.")
    except Exception as e:
        print("Error al eliminar el horario:", e)
    finally:
        conn.close()

# Ejemplo de uso
if __name__ == "__main__":
    # Crear un horario
    nuevo_horario = ('08:00:00', '10:00:00', 'L', 'Lunes', 1, 1)
    id_h = create_horario(nuevo_horario)

    # Leer todos los horarios
    horarios = read_all_horarios()
    print(horarios)

    # Leer un horario por Id
    horario = read_horario_by_id(id_h)
    print(horario)

    # Actualizar un horario
    update_horario(id_h, ('09:00:00', '11:00:00', 'M', 'Martes', 2, 2))

    # Eliminar un horario
    delete_horario(id_h)
