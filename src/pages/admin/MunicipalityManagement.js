import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  h2 {
    color: var(--primary-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      color: var(--secondary-color);
    }
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color);
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: var(--secondary-color);
    }
  }
`;

const AddButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;

  &:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: var(--support-color);

    th {
      padding: 1rem;
      text-align: left;
      color: var(--primary-color);
      font-weight: 600;
      border-bottom: 2px solid var(--border-color);
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid var(--border-color);
      transition: all 0.3s;

      &:hover {
        background: var(--support-color);
      }
    }

    td {
      padding: 1rem;
      color: var(--text-color);
    }
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? 'var(--error-color)' : 'var(--secondary-color)'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  transition: all 0.3s;

  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    color: var(--primary-color);
    font-size: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    color: var(--text-color);
    font-weight: 600;
  }

  input, select {
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: var(--secondary-color);
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;

  &.primary {
    background: var(--primary-color);
    color: white;

    &:hover {
      background: var(--secondary-color);
    }
  }

  &.secondary {
    background: transparent;
    color: var(--text-color);
    border: 2px solid var(--border-color);

    &:hover {
      background: var(--support-color);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-color);

  svg {
    font-size: 3rem;
    color: var(--secondary-color);
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
`;

const MunicipalityManagement = () => {
  const [municipalities, setMunicipalities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMunicipality, setEditingMunicipality] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    state: 'MA'
  });

  // Função para buscar municípios da API
  const fetchMunicipalities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/municipalities');
      setMunicipalities(response.data);
      console.log('✅ Municípios carregados do banco:', response.data);
    } catch (error) {
      console.error('❌ Erro ao buscar municípios:', error);
      
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        toast.error('Não foi possível conectar com o servidor. Verifique se o backend está rodando na porta 5000.');
      } else {
        toast.error(`Erro ao carregar municípios: ${error.response?.data?.message || error.message}`);
      }
      
      setMunicipalities([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para carregar municípios quando o componente monta
  useEffect(() => {
    fetchMunicipalities();
  }, []);

  const filteredMunicipalities = municipalities.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (municipality = null) => {
    if (municipality) {
      setEditingMunicipality(municipality);
      setFormData({
        name: municipality.name,
        state: municipality.state
      });
    } else {
      setEditingMunicipality(null);
      setFormData({
        name: '',
        state: 'MA'
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingMunicipality(null);
    setFormData({
      name: '',
      state: 'MA'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Por favor, preencha o nome do município');
      return;
    }

    try {
      if (editingMunicipality) {
        // Editar município existente
        await api.put(`/municipalities/${editingMunicipality.id}`, formData);
        toast.success('Município atualizado com sucesso!');
      } else {
        // Adicionar novo município
        await api.post('/municipalities', formData);
        toast.success('Município cadastrado com sucesso!');
      }
      
      // Recarregar a lista de municípios
      await fetchMunicipalities();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar município:', error);
      const message = error.response?.data?.message || 'Erro ao salvar município';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este município?')) {
      try {
        await api.delete(`/municipalities/${id}`);
        toast.success('Município excluído com sucesso!');
        await fetchMunicipalities();
      } catch (error) {
        console.error('Erro ao excluir município:', error);
        const message = error.response?.data?.message || 'Erro ao excluir município';
        toast.error(message);
      }
    }
  };

  return (
    <>
      <Container>
        <Header>
          <h2>
            <FaMapMarkerAlt />
            Gerenciar Municípios
          </h2>
          <Controls>
            <SearchBar>
              <FaSearch />
              <input
                type="text"
                placeholder="Buscar município..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
            <AddButton onClick={() => handleOpenModal()}>
              <FaPlus />
              Novo Município
            </AddButton>
          </Controls>
        </Header>

        {filteredMunicipalities.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <th>Município</th>
                <th>Estado</th>
                <th>Usuários</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                    Carregando municípios...
                  </td>
                </tr>
              ) : filteredMunicipalities.map(municipality => (
                <tr key={municipality.id}>
                  <td>{municipality.name}</td>
                  <td>{municipality.state}</td>
                  <td>{municipality.users_count || 0}</td>
                  <td>
                    <Actions>
                      <ActionButton onClick={() => handleOpenModal(municipality)}>
                        <FaEdit />
                        Editar
                      </ActionButton>
                      <ActionButton danger onClick={() => handleDelete(municipality.id)}>
                        <FaTrash />
                        Excluir
                      </ActionButton>
                    </Actions>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            <FaMapMarkerAlt />
            <h3>Nenhum município encontrado</h3>
            <p>Adicione o primeiro município clicando no botão acima</p>
          </EmptyState>
        )}
      </Container>

      {modalOpen && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>{editingMunicipality ? 'Editar Município' : 'Novo Município'}</h3>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Nome do Município *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: São Luís"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Estado *</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                >
                  <option value="MA">Maranhão</option>
                  <option value="PA">Pará</option>
                  <option value="TO">Tocantins</option>
                  <option value="PI">Piauí</option>
                </select>
              </FormGroup>
              <ModalActions>
                <Button type="button" className="secondary" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button type="submit" className="primary">
                  {editingMunicipality ? 'Salvar Alterações' : 'Cadastrar'}
                </Button>
              </ModalActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default MunicipalityManagement;
