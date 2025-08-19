import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LockOutlined,
    PersonOutline,
    Visibility,
    VisibilityOff,
    Security,
    AdminPanelSettings
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import './Auth.scss';

const Auth = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(formData.username, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async (username, password) => {
        setFormData({ username, password });
        setLoading(true);
        setError('');

        try {
            await login(username, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <motion.div
                className="auth-container"
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
            >
                <div className="auth-header">
                    <div className="auth-icon">
                        <Security />
                    </div>
                    <h2>Bienvenue</h2>
                    <p>Connectez-vous pour accéder à votre espace</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <PersonOutline className="input-icon" />
                        <input
                            type="text"
                            name="username"
                            className="input-field"
                            placeholder="Nom d'utilisateur"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <LockOutlined className="input-icon" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            className="input-field"
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}

                <div className="demo-logins">
                    <h4>Accès rapide</h4>
                    <div className="demo-buttons">
                        <button onClick={() => handleDemoLogin('user', 'user123')} className="demo-button">
                            <PersonOutline /> Utilisateur
                        </button>
                        <button onClick={() => handleDemoLogin('admin', 'admin123')} className="demo-button">
                            <AdminPanelSettings /> Admin
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
