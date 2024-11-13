from flask import Flask, request, jsonify
from flask_cors import CORS
import getAsistencias as ga
import sendAsistencias as sa
import getAulas as gau
import getUser as gu
import datetime
app = Flask(__name__)
CORS(app)  # Esto permite peticiones desde el frontend React

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
    aula = request.args.get('aula')
    asistencias = request.args.get('asistencias')
    fecha = request.args.get('fecha')
    sa.insert_asistencia_Aula(aula,asistencias,fecha)
    return 

if __name__ == '__main__':
    app.run(debug=True)