import psycopg2
from config import get_connection
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
    CONSTRAINT FK_8 FOREIGN KEY (Id_Aula) REFERENCES Aula (Id_Aula)
);
"""
from datetime import datetime
def create_horario(data):
    query = """
    INSERT INTO Horario (Id_H, Hora_i, Hora_f, Dia_I, Dia_text, Id_Aula)
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING Id_H;
    """
    conn = get_connection()  # Asegúrate de que esta función esté correctamente implementada
    try:
        with conn:
            with conn.cursor() as cur:
                # Obtener el grado del aula
                cur.execute("SELECT Grado FROM Aula WHERE Id_Aula = %s", (data["Id_Aula"],))
                grado = cur.fetchone()
                
                if not grado:
                    raise ValueError("El aula especificada no existe.")
                
                grado = grado[0]  # Extraer el valor del grado

                # Validar la cantidad de horarios existentes para el aula
                cur.execute("""
                    SELECT Hora_i, Hora_f 
                    FROM Horario 
                    WHERE Id_Aula = %s
                """, (data["Id_Aula"],))
                horarios_existentes = cur.fetchall()

                # Calcular la duración total actual en minutos
                duracion_total_existente = sum(
                    (hora_f - hora_i).total_seconds() / 60 
                    for hora_i, hora_f in horarios_existentes
                )

                # Calcular la duración del nuevo horario
                hora_i = data["Hora_i"]
                hora_f = data["Hora_f"]
                nueva_duracion = (hora_f - hora_i).total_seconds() / 60

                # Sumar la duración existente con la del nuevo horario
                duracion_total = duracion_total_existente + nueva_duracion

                # Validar límites según el grado
                if grado in range(0, 5):  # Grados de 0 a 4
                    if len(horarios_existentes) >= 1:
                        raise ValueError("Los cursos de grado 0 a 4 solo pueden tener un horario.")
                    if duracion_total > 60:
                        raise ValueError("La duración total del horario para grados 0 a 4 no puede superar los 60 minutos.")
                elif grado == 5:  # Grado 5
                    if duracion_total > 120:
                        raise ValueError("La duración total del horario para grado 5 no puede superar los 120 minutos.")

                # Obtener el último ID
                cur.execute("SELECT COALESCE(MAX(Id_H), 0) FROM Horario")
                last_id = cur.fetchone()[0]
                new_id = last_id + 1
                
                # Agregar el nuevo ID al diccionario
                data["Id_H"] = new_id
                
                # Ejecutar el query con parámetros
                cur.execute(query, (
                    data["Id_H"], data["Hora_i"], data["Hora_f"], 
                    data["Dia_I"], data["Dia_text"],
                    data["Id_Aula"]
                ))
                
                # Obtener el ID retornado
                id_h = cur.fetchone()[0]
                print(f"Horario creado exitosamente con Id_H: {id_h}")
                return id_h
    except Exception as e:
        print("Error al crear el horario:", e)
        raise e  # Vuelve a lanzar la excepción para que sea capturada por el manejador de errores en el endpoint
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
