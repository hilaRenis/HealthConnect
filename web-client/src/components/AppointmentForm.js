import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const AppointmentForm = ({
  onSubmit,
  defaultValues,
  patients = [],
  doctors = [],
  title = 'Create Appointment',
  submitLabel = 'Create Appointment',
  hideDoctorSelect = false,
}) => {
  const { register, handleSubmit, control, reset } = useForm({ defaultValues });

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        startTime: defaultValues.startTime || null,
      });
    }
  }, [defaultValues, reset]);

  return (
      <Card sx={{ width: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Patient */}
              <FormControl fullWidth>
                <InputLabel>Patient</InputLabel>
                <Select
                  {...register('patientId', { required: true })}
                  defaultValue={defaultValues?.patientId || ''}
                >
                  {patients.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {!hideDoctorSelect && (
                <FormControl fullWidth>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    {...register('doctorId', { required: true })}
                    defaultValue={defaultValues?.doctorId || ''}
                  >
                    {doctors.map((d) => (
                        <MenuItem key={d.id} value={d.id}>
                          {d.name}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* DateTime */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                    name="startTime"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                        <DateTimePicker
                            label="Appointment Time"
                            value={field.value}
                            onChange={field.onChange}
                            renderInput={(params) => <TextField {...params} fullWidth />}
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
