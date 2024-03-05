'use client'
import React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './listItems';

import Modal from '@mui/material/Modal';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import FullCalendar from '@fullcalendar/react';
// FullCalendarで月表示を可能にするプラグイン。
import dayGridPlugin from '@fullcalendar/daygrid';
// FullCalendarで日付や時間が選択できるようになるプラグイン。
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from '@fullcalendar/core/locales/ja'; 
// import timeGridPlugin from '@fullcalendar/timegrid';



function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
      textAlign: 'center'
    };

  const [AppOpen, setAppOpen] = React.useState(false);
  const [Modelopen, setModelOpen] = React.useState(false);
  const [events, setEvents] = React.useState([]);
  const [days, setdays] = React.useState("");
  const [starttime, setStartTime] = React.useState<Dayjs | null>(dayjs());
  const [endtime, setEndTime] = React.useState<Dayjs | null>(dayjs());
  const [error, setError] = React.useState<string | null>(null);


  const handleOpen = () => setModelOpen(true);
  const handleClose = () => setModelOpen(false);

  
  const toggleDrawer = () => {
    setAppOpen(!AppOpen);
  };



  const handleAddEvent = () => {

    if (starttime!.isAfter(endtime!)) {
      setError('Start time cannot be after end time');
      return;
    }

    if (starttime!.isSame(endtime!)) {
      setError('Start time and end time cannot be the same');
      return;
    }

    const dateObject = dayjs(days).toDate();
    const starttimeObject = dayjs(dateObject).hour(starttime!.hour()).set('minute', 0).toDate();
    const endtimeObject = dayjs(dateObject).hour(endtime!.hour()).set('minute', 0).toDate();

    const title=starttime?.hour().toString()+":00"+"-"+endtime?.hour().toString()+":00";

    const isDuplicate = events.some((event) => {
      const eventDate = dayjs(event.start).format('MM-DD');
      const currentDate = dayjs(dateObject).format('MM-DD');
      return eventDate === currentDate;
    });
    if (isDuplicate) {
      setError('An event already exists for the selected date');
      return;
    }

    const newEvent = {
      title: title,
      start: starttimeObject,
      end: endtimeObject,
      description: "新しい予定の説明",
      backgroundColor: "orange",
      borderColor: "orange"
    };

    setEvents([...events, newEvent]);
    setStartTime(dayjs());
    setEndTime(dayjs());
    handleClose();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={AppOpen}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(AppOpen && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              SHIFT
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={AppOpen}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                contentHeight="auto"
                aspectRatio={1.6}
                businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
                locales={[jaLocale]}        
                locale='ja'
                selectable={true}
                editable={true}
                displayEventTime={false}
                eventClick={() => {
                  handleOpen();
                }}
                dateClick={(info) => {
                  setdays(info.dateStr);
                  setError(null);
                  handleOpen();
                }}
              />
            </Container>
          </Box>

          <Modal
            open={Modelopen}
            onClose={handleClose}
          >
            <Box sx={style}>
              <Container maxWidth="lg">
                <Typography id="modal-title" variant="h5" component="h1" >
                  {days}
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    sx={{ mt: 3 }}
                    label="Start"
                    value={starttime}
                    views={['hours']}
                    onChange={(newstartTime) => {
                      setStartTime(newstartTime);
                    }}
                    ampm={false}
                  />
                  <TimePicker
                    sx={{ mt: 3 }}
                    label="End"
                    value={endtime}
                    views={['hours']}
                    onChange={(newendTime) => {
                      setEndTime(newendTime);
                    }}
                    ampm={false}
                  />
                  
                </LocalizationProvider>
                {error && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
                <Button
                  sx={{ mt: 3 }}
                  variant="contained"
                  onClick={handleAddEvent}
                >
                  Add
                </Button>
              </Container>
            </Box>
          </Modal>
      </Box>
    </ThemeProvider>
  );
}