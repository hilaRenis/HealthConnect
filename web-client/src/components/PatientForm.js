import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button, Paper, TextField, Typography} from '@mui/material';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';

const PatientForm = ({onSubmit, defaultValues, isEdit = false, doctors = []}) => {
    const mapDefaults = (values) => {
        if (!values) return {};
        const {dob, ...rest} = values;
        return {
            ...rest,
            dob: dob ? new Date(dob) : null,
            password: ''
        };
    };

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: {errors}
    } = useForm({defaultValues: mapDefaults(defaultValues)});

    useEffect(() => {
        if (defaultValues) {
            reset(mapDefaults(defaultValues));
        }
    }, [defaultValues, reset]);

    return (
        <Paper style={{padding: 16}}>
            <Typography variant="h6">{isEdit ? 'Edit Patient' : 'Create Patient'}</Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    {...register('name', {required: 'Name is required'})}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Controller
                        name="dob"
                        control={control}
                        render={({field}) => (
                            <DatePicker
                                label="Date of Birth"
                                value={field.value || null}
                                onChange={field.onChange}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: 'normal'
                                    }
                                }}
                            />
                        )}
                    />
                </LocalizationProvider>

                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {value: /\S+@\S+\.\S+/, message: 'Invalid email'}
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    {...register('password', {
                        // Same field visible for both modes.
                        // Only required when creating; optional on edit.
                        ...(isEdit
                            ? {}
                            : {required: 'Password is required'})
                    })}
                    error={!!errors.password}
                    helperText={
                        isEdit
                            ? 'Leave blank to keep the current password'
                            : errors.password?.message
                    }
                />


                <Button type="submit" variant="contained" color="primary" sx={{mt: 2}}>
                    {isEdit ? 'Save Changes' : 'Create Patient'}
                </Button>
            </form>
        </Paper>
    );
};

export default PatientForm;
