import React from 'react';
import {useForm} from 'react-hook-form';
import {Button, Paper, TextField, Typography} from '@mui/material';

const DoctorForm = ({onSubmit, defaultValues, isEdit = false}) => {
    const {register, handleSubmit} = useForm({
        defaultValues: {
            password: '',
            ...defaultValues,
        },
    });

    return (
        <Paper style={{padding: '16px'}}>
            <Typography variant="h6">{isEdit ? 'Edit Doctor' : 'Create Doctor'}</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    {...register('name', {required: true})}
                />
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
                    placeholder={isEdit ? 'Leave blank to keep current password' : ''}
                    {...register('password', isEdit ? {} : {required: true})}
                />
                <Button type="submit" variant="contained" color="primary">
                    {isEdit ? 'Save Changes' : 'Create Doctor'}
                </Button>
            </form>
        </Paper>
    );
};

export default DoctorForm;
