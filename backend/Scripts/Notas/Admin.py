from sqlalchemy import text

def aconsultarnota(db, institucion=None, profesor=None,grupo=None):
    try:
        # Lee el archivo SQL
        with open("Scripts/Notas/ConsultaNotasAdmin.sql", "r") as file:
            sql_query = file.read()

        # Ejecuta la consulta con los parámetros (institucion y profesor son opcionales)
        resultado = db.session.execute(text(sql_query), {
            'institucion': institucion,
            'profesor': profesor,
            'grupo': grupo
        })
        
        columnas = ['profesor', 'grupo', 'estudiante', 'institucion', 'nota_1', 'nota_2', 'nota_3', 'nota_4']
        # Convierte los resultados en una lista de diccionarios
        resultados = [dict(zip(columnas,row)) for row in resultado]
        
        return resultados
    
    except Exception as e:
        return {"error": str(e)}
