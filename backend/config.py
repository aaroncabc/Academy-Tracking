import psycopg2
SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:titajose23@localhost/Flake'

SQLALCHEMY_TRACK_MODIFICATIONS = False

# Configuración de conexión
def get_connection():
    return psycopg2.connect(
        dbname="Flake",
        user="postgres",
        password="titajose23",
        host="localhost",
        port="5432"
    )

