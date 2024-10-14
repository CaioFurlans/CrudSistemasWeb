from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, resources={r"/usuarios/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST", "PUT", "DELETE"]}})

# Configuração da conexão com o banco de dados
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

@app.route('/usuarios', methods=['POST'])
def adicionar_usuario():
    try:
        data = request.get_json()
        nome = data.get('nome')
        email = data.get('email')

        if not nome or not email:
            return jsonify({'error': 'Nome e email são obrigatórios!'}), 400

        cursor = db.cursor()
        cursor.execute("INSERT INTO usuarios (nome, email) VALUES (%s, %s)", (nome, email))
        db.commit()

        return jsonify({'id': cursor.lastrowid, 'nome': nome, 'email': email}), 201
    except Exception as e:
        print("Erro ao adicionar usuário:", e)
        return jsonify({'error': 'Erro ao adicionar usuário.'}), 500

@app.route('/usuarios/<int:id>', methods=['PUT'])
def editar_usuario(id):
    try:
        data = request.get_json()
        nome = data.get('nome')
        email = data.get('email')

        if not nome or not email:
            return jsonify({'error': 'Nome e email são obrigatórios!'}), 400

        cursor = db.cursor()
        cursor.execute("UPDATE usuarios SET nome=%s, email=%s WHERE id=%s", (nome, email, id))
        db.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': 'Usuário não encontrado!'}), 404

        return jsonify({'id': id, 'nome': nome, 'email': email}), 200
    except Exception as e:
        print("Erro ao editar usuário:", e)
        return jsonify({'error': 'Erro ao editar usuário.'}), 500

@app.route('/usuarios/<int:id>', methods=['DELETE'])
def deletar_usuario(id):
    try:
        cursor = db.cursor()
        cursor.execute("DELETE FROM usuarios WHERE id=%s", (id,))
        db.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': 'Usuário não encontrado!'}), 404

        return jsonify({'message': 'Usuário deletado com sucesso!'}), 200
    except Exception as e:
        print("Erro ao deletar usuário:", e)
        return jsonify({'error': 'Erro ao deletar usuário.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
