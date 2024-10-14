import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState(null); // ID do usuário que está sendo editado

  // Buscar usuários ao carregar o componente
  useEffect(() => {
    axios.get('http://localhost:5000/usuarios')
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar usuários', error);
      });
  }, []);

  // Adicionar ou Editar usuário
  const salvarUsuario = () => {
    if (!nome || !email) {
      alert('Preencha todos os campos antes de salvar.');
      return;
    }

    if (editId === null) {
      // Adicionar novo usuário
      axios.post('http://localhost:5000/usuarios', { nome, email })
        .then((response) => {
          setUsuarios([...usuarios, { id: response.data.id, nome, email }]);
          setNome('');
          setEmail('');
          alert('Usuário adicionado com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao adicionar usuário', error);
        });
    } else {
      // Editar usuário existente
      axios.put(`http://localhost:5000/usuarios/${editId}`, { nome, email })
        .then(() => {
          setUsuarios(usuarios.map((usuario) =>
            usuario.id === editId ? { ...usuario, nome, email } : usuario
          ));
          setNome('');
          setEmail('');
          setEditId(null);
          alert('Usuário editado com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao editar usuário', error);
        });
    }
  };

  // Função para preparar o formulário com os dados para edição
  const editarUsuario = (id) => {
    const usuario = usuarios.find((usuario) => usuario.id === id);
    if (usuario) {
      setEditId(id);
      setNome(usuario.nome);
      setEmail(usuario.email);
    }
  };

  // Deletar usuário
  const deletarUsuario = (id) => {
    axios.delete(`http://localhost:5000/usuarios/${id}`)
      .then(() => {
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
        alert('Usuário deletado com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao deletar usuário', error);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gerenciamento de Usuários</h1>

      <div style={{
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px'
      }}>
        <h2>{editId ? 'Editar Usuário' : 'Adicionar Usuário'}</h2>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ marginRight: '10px', padding: '5px', width: '200px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: '10px', padding: '5px', width: '200px' }}
        />
        <button onClick={salvarUsuario} style={{
          padding: '5px 10px',
          backgroundColor: editId ? 'orange' : 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          {editId ? 'Salvar Alterações' : 'Adicionar Usuário'}
        </button>
        {editId && (
          <button onClick={() => {
            setEditId(null);
            setNome('');
            setEmail('');
          }} style={{
            padding: '5px 10px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginLeft: '10px',
            cursor: 'pointer'
          }}>
            Cancelar Edição
          </button>
        )}
      </div>

      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {usuarios.map((usuario) => (
          <li key={usuario.id} style={{
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{usuario.nome} - {usuario.email}</span>
            <div>
              <button onClick={() => editarUsuario(usuario.id)} style={{
                padding: '5px 10px',
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                marginRight: '10px',
                cursor: 'pointer'
              }}>
                Editar
              </button>
              <button onClick={() => deletarUsuario(usuario.id)} style={{
                padding: '5px 10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Usuarios;
