from sqlalchemy import text

# Aquí, pasamos la instancia de db a la función, o importamos db si es necesario.
def consultanotas(db, nombre_profesor, grupo=None):
    try:
        # Lee el archivo SQL
        with open("backend/Scripts/Notas/ConsultarNotas_profesor.sql", "r") as file:
            sql_query = file.read()
        
        # Ejecuta el query con el parámetro 'nombre_profesor'
        resultado = db.session.execute(text(sql_query), {'nombre_profesor': nombre_profesor, 'grupo': grupo})
        
        # Convertimos los resultados a una lista de diccionarios
        columnas = ['nombre_profesor', 'grupo', 'estudiante', 'nota_1', 'nota_2', 'nota_3', 'nota_4']
        resultados = [dict(zip(columnas, row)) for row in resultado]
        
        return resultados
    except Exception as e:
        return {"error": str(e)}

def update_notas(db, id_estudiante, nota_1, nota_2, nota_3, nota_4):
    try:
        # Construimos el query SQL
        sql_query = """
        UPDATE notas
        SET nota_1 = :nota_1, nota_2 = :nota_2, nota_3 = :nota_3, nota_4 = :nota_4
        WHERE id_estudiante = :id_estudiante;
        """

        # Ejecutamos el query con los valores proporcionados
        db.session.execute(text(sql_query), {
            'nota_1': nota_1,
            'nota_2': nota_2,
            'nota_3': nota_3,
            'nota_4': nota_4,
            'id_estudiante': id_estudiante
        })
        db.session.commit()  # Confirmamos la transacción

        return {"message": "Notas actualizadas exitosamente."}
    except Exception as e:
        db.session.rollback()  # Hacemos rollback en caso de error
        return {"error": str(e)}