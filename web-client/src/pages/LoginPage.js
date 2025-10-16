import React from 'react';
import {useForm} from 'react-hook-form';
import {useAuth} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import {Button, Container, TextField, Typography} from '@mui/material';

const LoginPage = () => {
    const {register, handleSubmit} = useForm();
    const {login} = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to login', error);
            // Handle login error (e.g., show a message to the user)
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    {...register('email', {required: true})}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    {...register('password', {required: true})}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default LoginPage;
