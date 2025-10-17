import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import api, { testConnection } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Testar conexão primeiro
        const isConnected = await testConnection();
        if (!isConnected) {
          console.warn('⚠️ Não foi possível conectar com a API');
        }

        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔄 Tentando fazer login...', { email });
      
      const response = await api.post('/auth/login', {
        email,
        password
      });

      console.log('✅ Login bem-sucedido:', response.data);

      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Login realizado com sucesso!');
      return userData;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      
      let message = 'Erro ao fazer login';
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        message = 'Não foi possível conectar com o servidor. Verifique se o backend está rodando.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignorar erros de logout
      console.warn('Erro no logout (ignorado):', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.info('Logout realizado com sucesso');
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      // Simulação de atualização de senha
      // Em produção, fazer chamada para API
      toast.success('Senha atualizada com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao atualizar senha');
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      // Simulação de reset de senha
      // Em produção, fazer chamada para API
      toast.success(`Email de recuperação enviado para ${email}`);
      return true;
    } catch (error) {
      toast.error('Erro ao enviar email de recuperação');
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    updatePassword,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
