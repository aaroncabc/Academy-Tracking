from flask import Flask, jsonify
from flask_cors import CORS
import getAsistencias as ga
import sendAsistencias as sa
app = Flask(__name__)
CORS(app)  # Esto permite peticiones desde el frontend React

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {'message': 'Hello from Flask!'}
    return jsonify(data)

@app.route('/api/asistencias', methods=['GET'])
def get_asistencias():
    asistencias = ga.obtener_asistencias()
    return jsonify(asistencias)

@app.route('/api/asistencias', methods=['POST'])
def post_asistencias():
    sa.insert_asistencia_Aula()
    return 

if __name__ == '__main__':
    app.run(debug=True)