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
app = Flask(__name__)
CORS(app)  # Esto permite peticiones desde el frontend React



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

    if not aula or not asistencias or not fecha:
        return jsonify({"error": "Datos incompletos"}), 400

    try:
        response = sendAsistencias.insert_asistencia_Aula(aula, asistencias, fecha)
        return jsonify(response), 201
    except Exception as e:
        print(f"Error en el endpoint: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500


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