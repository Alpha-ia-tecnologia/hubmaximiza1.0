import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import SimpleLogo from '../components/SimpleLogo';
import ApiDebug from '../components/ApiDebug';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    animation: float 20s linear infinite;
  }

  @keyframes float {
    0% { transform: translate(0, 0); }
    100% { transform: translate(-50%, -50%); }
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    transform: translateX(-5px);
  }
`;

const BrandContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    svg {
      font-size: 3.5rem;
    }
  }

  p {
    font-size: 1.2rem;
    opacity: 0.95;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin-top: 3rem;

  li {
    padding: 1rem 0;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    &::before {
      content: '✓';
      background: rgba(255, 255, 255, 0.2);
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex: 1;
  }
`;

const LoginCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    color: var(--primary-color);
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-color);
  }
`;

const MobileBackButton = styled(Link)`
  display: none;
  color: var(--primary-color);
  text-decoration: none;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;

  @media (max-width: 768px) {
    display: flex;
  }

  &:hover {
    color: var(--secondary-color);
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

const RememberForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const ForgotLink = styled(Link)`
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
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

const DemoInfo = styled.div`
  background: var(--support-color);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  border-left: 4px solid var(--secondary-color);

  h4 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-color);
    font-size: 0.9rem;
    margin-bottom: 0.3rem;

    code {
      background: white;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
      color: var(--secondary-color);
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      
      // Redirecionar baseado no tipo de usuário
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      // Erro já tratado no contexto
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LeftPanel>
        <BackButton to="/">
          <FaArrowLeft />
          Voltar ao Site
        </BackButton>
        
        <BrandContainer>
          <SimpleLogo 
            size="large" 
            color="white"
          />
          <p>Hub de Soluções Educacionais</p>
        </BrandContainer>
        
        <FeaturesList>
          <li>Acesse todas as suas ferramentas em um só lugar</li>
          <li>Gestão integrada de soluções educacionais</li>
          <li>Relatórios e análises em tempo real</li>
          <li>Suporte dedicado para educadores</li>
        </FeaturesList>
      </LeftPanel>
      
      <RightPanel>
        <LoginCard>
          <MobileBackButton to="/">
            <FaArrowLeft />
            Voltar ao Site
          </MobileBackButton>
          
          <LoginHeader>
            <h2>Bem-vindo de Volta!</h2>
            <p>Faça login para acessar sua conta</p>
          </LoginHeader>
          
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <InputIcon>
                <FaEnvelope />
              </InputIcon>
              <Input
                type="email"
                name="email"
                placeholder="Seu e-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputGroup>
            
            <InputGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                type="password"
                name="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </InputGroup>
            
            <RememberForgot>
              <Checkbox>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                Lembrar-me
              </Checkbox>
              <ForgotLink to="/esqueci-senha">
                Esqueceu a senha?
              </ForgotLink>
            </RememberForgot>
            
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </SubmitButton>
          </Form>
          
          <DemoInfo>
            <h4>Contas de Demonstração:</h4>
            <p>
              Admin: <code>admin@hubmaximiza.com</code> / <code>admin123</code>
            </p>
            <p>
              Usuário: <code>usuario@maximiza.com.br</code> / <code>user123</code>
            </p>
          </DemoInfo>
        </LoginCard>
      </RightPanel>
      
      {/* Componente de debug apenas em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && <ApiDebug />}
    </Container>
  );
};

export default Login;
