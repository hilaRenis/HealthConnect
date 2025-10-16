import React from 'react';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@mui/material';
import {NavLink} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {Dashboard, Event, LocalHospital, LocalPharmacy, People} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = {
    admin: [
        {text: 'Dashboard', icon: <Dashboard/>, path: '/dashboard'},
        {text: 'Doctors', icon: <LocalHospital/>, path: '/doctors'},
        {text: 'Patients', icon: <People/>, path: '/patients'},
        {text: 'Appointments', icon: <Event/>, path: '/appointments'},
        {text: 'Prescriptions', icon: <LocalPharmacy/>, path: '/prescriptions'},
    ],
    doctor: [
        {text: 'Dashboard', icon: <Dashboard/>, path: '/dashboard'},
        {text: 'My Patients', icon: <People/>, path: '/my-patients'},
        {text: 'Appointments', icon: <Event/>, path: '/appointments'},
        {text: 'Prescriptions', icon: <LocalPharmacy/>, path: '/prescriptions'},
    ],
    patient: [
        {text: 'Dashboard', icon: <Dashboard/>, path: '/dashboard'},
        {text: 'My Appointments', icon: <Event/>, path: '/my-appointments'},
        {text: 'My Prescriptions', icon: <LocalPharmacy/>, path: '/my-prescriptions'},
    ],
};

const Layout = ({children}) => {
    const {user, logout} = useAuth();

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
                        HealthConnect
                    </Typography>
                    <Typography sx={{mr: 2}}>Welcome, {user.name}</Typography>
                    <button onClick={logout}>Logout</button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'},
                }}
            >
                <Toolbar/>
                <Box sx={{overflow: 'auto'}}>
                    <List>
                        {user && menuItems[user.role]?.map((item) => (
                            <ListItem button component={NavLink} to={item.path} key={item.text}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text}/>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Toolbar/>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
