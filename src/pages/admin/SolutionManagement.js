import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCogs, FaExternalLinkAlt } from 'react-icons/fa';
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

const SolutionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SolutionCard = styled.div`
  background: var(--support-color);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s;
  border: 2px solid transparent;

  &:hover {
    border-color: var(--secondary-color);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  h3 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  p {
    color: var(--text-color);
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  .url {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--secondary-color);
    font-size: 0.9rem;
    margin-bottom: 1rem;

    svg {
      font-size: 0.8rem;
    }
  }
`;

const CardActions = styled.div`
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
  max-height: 90vh;
  overflow-y: auto;
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

  input, textarea {
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: var(--secondary-color);
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
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

const SolutionManagement = () => {
  const [solutions, setSolutions] = useState([
    {
      id: 1,
      name: 'SALF - Sistema de Avaliação de Fluência',
      description: 'Plataforma completa para avaliação e acompanhamento da fluência em leitura.',
      url: 'https://salf.maximiza.com.br',
      icon: '📚'
    },
    {
      id: 2,
      name: 'SAG - Sistema de Avaliação e Gerenciamento',
      description: 'Sistema integrado para gestão completa do desempenho escolar.',
      url: 'https://sag.maximiza.com.br',
      icon: '📊'
    },
    {
      id: 3,
      name: 'Pensamento Computacional',
      description: 'Material estruturado para desenvolvimento de habilidades computacionais.',
      url: 'https://pc.maximiza.com.br',
      icon: '💻'
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    icon: ''
  });

  const handleOpenModal = (solution = null) => {
    if (solution) {
      setEditingSolution(solution);
      setFormData({
        name: solution.name,
        description: solution.description,
        url: solution.url,
        icon: solution.icon
      });
    } else {
      setEditingSolution(null);
      setFormData({
        name: '',
        description: '',
        url: '',
        icon: ''
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingSolution(null);
    setFormData({
      name: '',
      description: '',
      url: '',
      icon: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.url) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (editingSolution) {
      setSolutions(prev =>
        prev.map(s =>
          s.id === editingSolution.id
            ? { ...s, ...formData }
            : s
        )
      );
      toast.success('Solução atualizada com sucesso!');
    } else {
      const newSolution = {
        id: Date.now(),
        ...formData,
        icon: formData.icon || '🎯'
      };
      setSolutions(prev => [...prev, newSolution]);
      toast.success('Solução cadastrada com sucesso!');
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta solução?')) {
      setSolutions(prev => prev.filter(s => s.id !== id));
      toast.success('Solução excluída com sucesso!');
    }
  };

  return (
    <>
      <Container>
        <Header>
          <h2>
            <FaCogs />
            Gerenciar Soluções
          </h2>
          <AddButton onClick={() => handleOpenModal()}>
            <FaPlus />
            Nova Solução
          </AddButton>
        </Header>

        <SolutionsGrid>
          {solutions.map(solution => (
            <SolutionCard key={solution.id}>
              <h3>
                <span>{solution.icon} {solution.name}</span>
              </h3>
              <p>{solution.description}</p>
              <div className="url">
                <FaExternalLinkAlt />
                {solution.url}
              </div>
              <CardActions>
                <ActionButton onClick={() => handleOpenModal(solution)}>
                  <FaEdit />
                  Editar
                </ActionButton>
                <ActionButton danger onClick={() => handleDelete(solution.id)}>
                  <FaTrash />
                  Excluir
                </ActionButton>
              </CardActions>
            </SolutionCard>
          ))}
        </SolutionsGrid>
      </Container>

      {modalOpen && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>{editingSolution ? 'Editar Solução' : 'Nova Solução'}</h3>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Nome da Solução *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Sistema de Avaliação"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Descrição *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a solução..."
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>URL de Acesso *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://exemplo.maximiza.com.br"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Ícone (Emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Ex: 📚"
                  maxLength="2"
                />
              </FormGroup>
              <ModalActions>
                <Button type="button" className="secondary" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button type="submit" className="primary">
                  {editingSolution ? 'Salvar Alterações' : 'Cadastrar'}
                </Button>
              </ModalActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default SolutionManagement;
