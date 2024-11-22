import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
import getAsistencias as ga
import sendAsistencias
import getAulas as gau
import getUser as gu
import GetInstituciones as gi
import crudPersona
import crudInstitucion
import crudEstudiante
import crudHorario
import crudAula
import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from config import get_connection

app = Flask(__name__)
CORS(app)  # Esto permite peticiones desde el frontend React

@app.route('/api/notas/<int:id_aula>', methods=['GET', 'POST'])
def manejar_notas(id_aula):
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Obtener estudiantes y sus notas
        if request.method == 'GET':
            query = """
                SELECT 
                    e.Id_Std, 
                    e.Nombre || ' ' || COALESCE(e.Segundo_nombre, '') || ' ' || e.apellido1 || ' ' || e.apellido2 AS Nombre_Completo,
                    COALESCE(n.Nota_1, 0) AS Nota_1,
                    COALESCE(n.Nota_2, 0) AS Nota_2,
                    COALESCE(n.Nota_3, 0) AS Nota_3,
                    COALESCE(n.Nota_4, 0) AS Nota_4
                FROM Estudiantes e
                LEFT JOIN Notas n ON e.Id_Std = n.Id_Estudiante
                WHERE e.Id_Salon = %s;
            """
            cursor.execute(query, (id_aula,))
            estudiantes = cursor.fetchall()
            return jsonify(estudiantes), 200

        # Actualizar o crear notas
        elif request.method == 'POST':
            data = request.json  # Formato esperado: [{Id_Std, Nota_1, Nota_2, Nota_3, Nota_4}, ...]
            if not isinstance(data, list):  # Validar que el formato sea una lista
                raise ValueError("El formato de los datos enviados es incorrecto")

            for estudiante in data:
                # Validar la presencia de los campos esperados
                if not all(key in estudiante for key in ['id_std', 'Nota_1', 'Nota_2', 'Nota_3', 'Nota_4']):
                    raise ValueError("Datos incompletos en uno o más registros")
                
                id_std = estudiante['id_std']
                notas = (
                    estudiante.get('Nota_1', 0),
                    estudiante.get('Nota_2', 0),
                    estudiante.get('Nota_3', 0),
                    estudiante.get('Nota_4', 0)
                )

                # Verificar si existen las notas
                cursor.execute("SELECT Id_Notas FROM Notas WHERE Id_Estudiante = %s", (id_std,))
                nota_existente = cursor.fetchone()

                if nota_existente:
                    # Actualizar notas existentes
                    cursor.execute("""
                        UPDATE Notas 
                        SET Nota_1 = %s, Nota_2 = %s, Nota_3 = %s, Nota_4 = %s
                        WHERE Id_Estudiante = %s
                    """, (*notas, id_std))
                else:
                    cursor.execute("SELECT COALESCE(MAX(id_notas), 0) FROM notas")
                    last_id = cursor.fetchone()  # fetchone() devuelve una tupla
                    new_id = last_id.get('coalesce',0)+ 1

                    # Crear nuevas notas
                    cursor.execute("""
                        INSERT INTO Notas (id_notas,Nota_1, Nota_2, Nota_3, Nota_4, Id_Estudiante) 
                        VALUES (%s,%s, %s, %s, %s, %s)
                    """, (new_id,*notas, id_std))
            conn.commit()
            return jsonify({"message": "Notas actualizadas correctamente"}), 200

    except Exception as e:
        # Loguea el error para depuración
        print(f"Error: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/api/esTutor',methods=['GET'])
def get_estutor():
    tutor = request.args.get("tutor")
    aula = request.args.get("aula")
    estutor = ga.esTutor(tutor,aula)
    return jsonify({"esTutor":estutor})

@app.route('/api/validarUsuario', methods=['GET'])
def get_User():
    usuario = request.args.get('usuario')
    user = gu.obtener_usuario(usuario)
    return jsonify(user)

@app.route('/api/obtenerRol', methods=['GET'])
def get_Rol():
    usuario = request.args.get('usuario')
    rol = gu.obtener_rol(usuario)
    return jsonify(rol)
    





@app.route('/api/aulas',methods=['GET'])
def get_aulas():
    return gau.obtener_aulas()

    
@app.route('/api/aulasTutor', methods=['GET'])
def get_aulas_ByTutor():
    tutor = request.args.get('tutor')
    aulas = ga.obtener_aulas_tutor(tutor)
    return jsonify(aulas)

@app.route('/api/porTomar', methods=['GET'])
def get_asistencias():
    tutor = request.args.get('tutor')
    asistencias = ga.obtener_aulas_del_dia_byTutor(tutor)
    return jsonify(asistencias)

@app.route('/api/listaAlumnos', methods=['GET'])
def get_lista_alumnos():
    aula = request.args.get('aula')
    alumnos = ga.obtener_lista_Alumnos(aula)
    return jsonify(alumnos)

@app.route('/api/tomarAsistencia', methods=['POST'])
def post_asistencias():
    data = request.json

    # Validar datos de entrada
    aula = data.get('aula')
    asistencias = data.get('asistencias')
    fecha = data.get('fecha')
    atutor = data.get('atutor')
    motivo = data.get('motivo')
    if not aula or not asistencias or not fecha:
        return jsonify({"error": "Datos incompletos"}), 400

    try:
        response = sendAsistencias.insert_asistencia_Aula(aula, asistencias, fecha, atutor, motivo)
        return jsonify(response), 201
    except Exception as e:
        return jsonify({"details": str(e)}), 400


@app.route('/api/escuelas', methods=['GET'])
def get_escuelas():
    escuelas=gi.obtener_escuelas()
    print(escuelas)
    return jsonify(escuelas)


@app.route('/api/getPersonas', methods=['GET'])
def get_personas():
    try:
        personas = crudPersona.read_all_personas()
        return jsonify(personas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/createPersona', methods=['POST'])
def post_persona():
    data = request.json
    required_fields = ["Nombre", "Apellido1","Apellido2","Tipo_identificacion","Numero_documento","Direccion", "Celular", "Cargo", "Usuario","Password"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"El campo {field} es obligatorio"}), 400

    try:
        persona_id = crudPersona.create_persona(
            data
        )
        return jsonify({"message": "Persona creada exitosamente", "Id_Persona": persona_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/getInstituciones', methods=['GET'])
def get_instituciones():
    try:
        instituciones = crudInstitucion.read_all_instituciones()
        return jsonify(instituciones), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/getAulas', methods=['GET'])
def get_all_aulas():
    try:
        aulas = crudAula.read_all_aulas()
        return jsonify(aulas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/getAulasHorario', methods=['GET'])
def get_all_aulas_horario_Bytutor():
    id_tutor = request.args.get('id_tutor')
    try:
        aulas = crudAula.read_all_aulas_horario_byTutor(id_tutor)
        return jsonify(aulas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/getAulasHorarioAll', methods=['GET'])
def get_all_aulas_horario():
    try:
        aulas = crudAula.read_all_aulas_horario()
        return jsonify(aulas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
  
@app.route('/api/createAula', methods=['POST'])  
def create_aula_endpoint():
    """
    Endpoint para crear un aula en la tabla Aula.
    """
    data = request.json

    # Validación básica
    required_fields = ["Grupo", "Jornada", "Grado", "GradoT", "Id_persona", "Id_institucion", "Año"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"El campo {field} es obligatorio"}), 400

    try:
        aula_id = crudAula.create_aula(
            data
        )
        return jsonify({"message": "Aula creada exitosamente", "Id_Aula": aula_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/createEstudiante', methods=['POST'])
def crear_estudiante():
    try:
        # Obtener los datos del cuerpo de la solicitud
        data = request.get_json()
        
        # Validar que los datos necesarios estén presentes
        required_fields = [
            "Nombre", "Segundo_nombre", "Apellido1", "Apellido2", "Tipo_Identificacion",
            "Numero_identificacion", "Genero", "Estrato", "F_nacimiento", "Id_Salon"
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"El campo {field} es obligatorio"}), 400
        
        # Crear el estudiante
        id_std = crudEstudiante.create_estudiante(data)
        return jsonify({"message": "Estudiante creado exitosamente", "Id_Std": id_std}), 201
    except Exception as e:
        return jsonify({"error": "Error al crear el estudiante", "details": str(e)}), 500


@app.route('/api/createHorario', methods=['POST'])
def crear_horario():
    try:
        # Obtener los datos del cuerpo de la solicitud
        data = request.get_json()
        
        # Validar que los datos necesarios estén presentes
        required_fields = [
            "Hora_i", "Hora_f", "Dia_I", "Dia_text", "Id_Aula"
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"El campo {field} es obligatorio"}), 400
        
        # Crear el horario
        id_h = crudHorario.create_horario(data)
        return jsonify({"message": "Horario creado exitosamente", "Id_H": id_h}), 201
    except Exception as e:
        return jsonify({"error": "Error al crear el horario", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)