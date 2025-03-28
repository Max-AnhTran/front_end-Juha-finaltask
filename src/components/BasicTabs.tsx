import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import Home from '../pages/Home';
import Customers from '../pages/Customers';
import Trainings from '../pages/Trainings';
import CalendarPage from '../pages/Calendar';
import Statistics from '../pages/Statistics';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="HOME" {...a11yProps(0)} />
          <Tab label="CUSTOMERS" {...a11yProps(1)} />
          <Tab label="TRAININGS" {...a11yProps(2)} />
          <Tab label="CALENDAR" {...a11yProps(3)} />
          <Tab label="STATISTICS" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Home />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Customers />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Trainings />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <CalendarPage />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Statistics />
      </CustomTabPanel>
    </Box>
  );
}
