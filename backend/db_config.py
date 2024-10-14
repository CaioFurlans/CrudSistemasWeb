from flask import Flask, jsonify, request
import mysql.connector

app = Flask(__name__)

# Configurando a conexão com o banco de dados
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="123456",
    database="crud"
)

@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios")
    usuarios = cursor.fetchall()
    return jsonify(usuarios)

# Outros endpoints...
