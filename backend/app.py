from flask import Flask, request, jsonify
from flask_cors import CORS
import getAsistencias as ga
import sendAsistencias as sa
import getAulas as gau
import getUser as gu
import GetInstituciones as gi
import crudPersona
import crudInstitucion
import crudAula
import datetime
import psycopg2
app = Flask(__name__)
CORS(app)  # Esto permite peticiones desde el frontend React



@app.route('/api/estutor',methods=['GET'])
def get_estutor():
    tutor = request.args.get("tutor")
    aula = request.args.get("aula")
    estutor = ga.esTutor(tutor,aula)
    return jsonify(estutor)

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
    

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {'message': 'Hello from Flask!'}
    return jsonify(data)

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
    aula = data.get('aula')
    asistencias = data.get('asistencias')
    fecha = data.get('fecha')
    tutor = data.get('tutor')
    atutor = data.get('atutor')
    sa.insertar_asistencia_Tutor(tutor,atutor)
    sa.insert_asistencia_Aula(aula,asistencias,fecha)
    return

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
            Nombre = data["Nombre"],
            Segundo_nombre = data.get("Segundo_nombre", None),
            Apellido1 = data["Apellido1"],
            Apellido2 = data["Apellido2"],
            Tipo_identificacion = data["Tipo_identificacion"],
            Numero_documento = data["Numero_documento"],
            Direccion = data["Direccion"],
            Celular = data["Celular"],
            Cargo = "Tutor",
            Usuario = data["Usuario"],
            Password = data["Password"]
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
            Grupo=data["Grupo"],
            GrupoT=data.get("GrupoT", None),
            Jornada=data["Jornada"],
            Grado=int(data["Grado"]),
            GradoT=data["GradoT"],
            Id_persona=int(data["Id_persona"]),
            Id_institucion=int(data["Id_institucion"]),
            Año=int(data["Año"])
        )
        return jsonify({"message": "Aula creada exitosamente", "Id_Aula": aula_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)