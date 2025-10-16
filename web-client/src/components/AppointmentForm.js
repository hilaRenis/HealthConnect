import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';

const AppointmentForm = ({
  onSubmit,
  defaultValues,
  patients = [],
  doctors = [],
  title = 'Create Appointment',
  submitLabel = 'Create Appointment',
  hideDoctorSelect = false,
}) => {
    const {control, handleSubmit, reset, formState: {errors}} = useForm({
        defaultValues: {
            patientId: '',
            doctorId: '',
            startTime: null,
            ...defaultValues,
        },
    });

    useEffect(() => {
        if (defaultValues) {
            reset({
                ...defaultValues,
                patientId: defaultValues.patientId || '',
                doctorId: defaultValues.doctorId || '',
                startTime: defaultValues.startTime ? new Date(defaultValues.startTime) : defaultValues.startTime || null,
            });
        }
    }, [defaultValues, reset]);

    return (
        <Card sx={{width: '100%', p: 2}}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        {/* Patient */}
                        <FormControl fullWidth error={!!errors.patientId}>
                            <InputLabel id="appointment-patient-select-label">Patient</InputLabel>
                            <Controller
                                name="patientId"
                                control={control}
                                rules={{required: 'Patient is required'}}
                                render={({field}) => (
                                    <Select
                                        {...field}
                                        labelId="appointment-patient-select-label"
                                        label="Patient"
                                        value={field.value || ''}
                                    >
                                        {patients.map((p) => (
                                            <MenuItem key={p.id} value={p.id}>
                                                {p.name || p.email || p.id}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.patientId && <FormHelperText>{errors.patientId.message}</FormHelperText>}
                        </FormControl>

                        {!hideDoctorSelect && (
                            <FormControl fullWidth error={!!errors.doctorId}>
                                <InputLabel id="appointment-doctor-select-label">Doctor</InputLabel>
                                <Controller
                                    name="doctorId"
                                    control={control}
                                    rules={{required: 'Doctor is required'}}
                                    render={({field}) => (
                                        <Select
                                            {...field}
                                            labelId="appointment-doctor-select-label"
                                            label="Doctor"
                                            value={field.value || ''}
                                        >
                                            {doctors.map((d) => (
                                                <MenuItem key={d.id} value={d.id}>
                                                    {d.name || d.email || d.id}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.doctorId && <FormHelperText>{errors.doctorId.message}</FormHelperText>}
                            </FormControl>
                        )}

                        {/* DateTime */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Controller
                                name="startTime"
                                control={control}
                                defaultValue={null}
                                rules={{required: 'Appointment time is required'}}
                                render={({field}) => (
                                    <DateTimePicker
                                        label="Appointment Time"
                                        value={field.value ?? null}
                                        onChange={field.onChange}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.startTime,
                                                helperText: errors.startTime?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>

                        <Button type="submit" variant="contained" color="primary">
                            {submitLabel}
                        </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    );
};

export default AppointmentForm;
