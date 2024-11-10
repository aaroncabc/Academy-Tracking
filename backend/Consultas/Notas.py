from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from backend.Scripts.Notas.Profesor import consultanotas,update_notas
from backend.Scripts.Notas.Admin import aconsultarnota


def mostrar_notas(db):
    try:
        # Obtenemos el nombre del profesor desde la query string
        nombre_profesor = request.args.get('nombre_profesor', '')
        grupo=request.args.get('grupo',None)
        
        if not nombre_profesor:
            return jsonify({"error": "El nombre del profesor es necesario"}), 400

        # Llamamos a la función ejecutar_query para obtener las notas
        notas = consultanotas(db, nombre_profesor,grupo)
        
        if 'error' in notas:
            return jsonify(notas), 500

        # Retornamos las notas como un JSON al frontend
        return jsonify(notas)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def mostrar_notas_admin(db):
    try:
        # Recibe los parámetros 'institucion' y 'profesor' de la URL (query params)
        institucion = request.args.get('institucion', None)
        profesor = request.args.get('profesor', None)
        grupo = request.args.get('grupo', None)

        # Llamamos a la función aconsultarnota con los parámetros
        notas = aconsultarnota(db, institucion, profesor, grupo)
        
        # Verificamos si hay error
        if 'error' in notas:
            return jsonify(notas), 500

        # Retorna los resultados como un JSON
        return jsonify(notas)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def actualizarnotas(db):
    try:
        # Obtener los datos del estudiante y las nuevas notas desde la solicitud JSON
        data = request.get_json()
        
        id_estudiante = data.get('id_estudiante')
        nota_1 = data.get('nota_1')
        nota_2 = data.get('nota_2')
        nota_3 = data.get('nota_3')
        nota_4 = data.get('nota_4')

        # Validar que se pasaron los datos correctos
        if not id_estudiante or None in [nota_1, nota_2, nota_3, nota_4]:
            return jsonify({"error": "Faltan datos para actualizar las notas."}), 400

        # Llamar a la función que ejecuta el update en la base de datos
        resultado = update_notas(db, id_estudiante, nota_1, nota_2, nota_3, nota_4)

        # Verificar si hubo un error o si todo fue bien
        if 'error' in resultado:
            return jsonify(resultado), 500
        return jsonify(resultado)

    except Exception as e:
        return jsonify({"error": str(e)}), 500