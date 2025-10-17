import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaLock, FaArrowLeft, FaSave } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-5px);
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);

  svg {
    color: var(--secondary-color);
    font-size: 1.5rem;
  }

  h2 {
    color: var(--primary-color);
    font-size: 1.5rem;
  }
`;

const ProfileInfo = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--support-color);
  border-radius: 8px;

  svg {
    color: var(--secondary-color);
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .content {
    flex: 1;

    .label {
      font-size: 0.85rem;
      color: var(--text-color);
      margin-bottom: 0.2rem;
    }

    .value {
      color: var(--primary-color);
      font-weight: 600;
      font-size: 1.1rem;
    }
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
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      color: var(--secondary-color);
    }
  }

  input {
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: var(--secondary-color);
      box-shadow: 0 0 0 3px rgba(0, 169, 232, 0.1);
    }
  }
`;

const PasswordRequirements = styled.ul`
  list-style: none;
  margin-top: 0.5rem;
  padding: 1rem;
  background: var(--support-color);
  border-radius: 8px;

  li {
    color: var(--text-color);
    font-size: 0.85rem;
    padding: 0.25rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before {
      content: '•';
      color: var(--secondary-color);
      font-weight: bold;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 1;

  &.primary {
    background: var(--primary-color);
    color: white;

    &:hover:not(:disabled) {
      background: var(--secondary-color);
      transform: translateY(-2px);
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const UserProfile = () => {
  const { user, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      // Erro já tratado no contexto
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Container>
      <Content>
        <Header>
          <BackButton onClick={handleBack}>
            <FaArrowLeft />
            Voltar
          </BackButton>
          <Title>Meu Perfil</Title>
        </Header>

        <Card>
          <CardHeader>
            <FaUser />
            <h2>Informações Pessoais</h2>
          </CardHeader>
          <ProfileInfo>
            <InfoItem>
              <FaUser />
              <div className="content">
                <div className="label">Nome Completo</div>
                <div className="value">{user?.name}</div>
              </div>
            </InfoItem>
            <InfoItem>
              <FaEnvelope />
              <div className="content">
                <div className="label">Email</div>
                <div className="value">{user?.email}</div>
              </div>
            </InfoItem>
            {user?.municipality && (
              <InfoItem>
                <FaMapMarkerAlt />
                <div className="content">
                  <div className="label">Município</div>
                  <div className="value">{user.municipality}</div>
                </div>
              </InfoItem>
            )}
            <InfoItem>
              <FaUser />
              <div className="content">
                <div className="label">Tipo de Conta</div>
                <div className="value">
                  {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                </div>
              </div>
            </InfoItem>
          </ProfileInfo>
        </Card>

        <Card>
          <CardHeader>
            <FaLock />
            <h2>Alterar Senha</h2>
          </CardHeader>
          <Form onSubmit={handlePasswordSubmit}>
            <FormGroup>
              <label>
                <FaLock />
                Senha Atual
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Digite sua senha atual"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>
                <FaLock />
                Nova Senha
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Digite a nova senha"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>
                <FaLock />
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirme a nova senha"
                required
              />
            </FormGroup>
            <PasswordRequirements>
              <li>A senha deve ter pelo menos 6 caracteres</li>
              <li>Use uma combinação de letras e números</li>
              <li>Evite senhas óbvias ou sequenciais</li>
            </PasswordRequirements>
            <ButtonGroup>
              <Button type="button" className="secondary" onClick={handleBack}>
                Cancelar
              </Button>
              <Button type="submit" className="primary" disabled={loading}>
                <FaSave />
                {loading ? 'Salvando...' : 'Salvar Nova Senha'}
              </Button>
            </ButtonGroup>
          </Form>
        </Card>
      </Content>
    </Container>
  );
};

export default UserProfile;
