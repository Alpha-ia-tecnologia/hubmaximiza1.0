import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaArrowLeft, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  svg {
    font-size: 3rem;
    color: var(--secondary-color);
    margin-bottom: 1rem;
  }

  h2 {
    color: var(--primary-color);
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-color);
    line-height: 1.6;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--secondary-color);
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 3px rgba(0, 169, 232, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: var(--secondary-color);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 169, 232, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 500;
  margin-top: 1.5rem;
  transition: all 0.3s;

  &:hover {
    color: var(--primary-color);
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  text-align: center;
  margin-bottom: 1rem;
`;

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (error) {
      // Erro já tratado no contexto
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Header>
          <FaGraduationCap />
          <h2>Recuperar Senha</h2>
          <p>
            Digite seu e-mail cadastrado e enviaremos instruções para redefinir sua senha.
          </p>
        </Header>
        
        {success && (
          <SuccessMessage>
            E-mail enviado com sucesso! Verifique sua caixa de entrada.
          </SuccessMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              placeholder="Seu e-mail cadastrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar E-mail de Recuperação'}
          </SubmitButton>
        </Form>
        
        <BackLink to="/login">
          <FaArrowLeft />
          Voltar ao Login
        </BackLink>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
