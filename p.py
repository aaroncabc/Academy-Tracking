from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from backend.Scripts.Notas.Profesor import consultanotas,update_notas
from backend.Scripts.Notas.Admin import aconsultarnota
from backend.Consultas.Notas import mostrar_notas, mostrar_notas_admin, actualizarnotas
# Inicializa la aplicación Flask
app = Flask(__name__)
app.config.from_pyfile('backend/config.py')

# Configura la conexión de la base de datos con SQLAlchemy
db = SQLAlchemy(app)

@app.route('/notas', methods=['GET'])
def notas():
    return mostrar_notas(db)
    
@app.route('/update_notas', methods=['POST'])
def actualizar_notas():
    return actualizarnotas(db)
    

@app.route('/AconsultarNotas', methods=['GET'])
def AconsultarNotas():
    return  mostrar_notas_admin(db)
@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
