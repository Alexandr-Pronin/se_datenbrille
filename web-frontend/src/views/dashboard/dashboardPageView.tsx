import React from "react";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Theme,
  makeStyles,
  Paper,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AvatarWithIcon } from "../../components/avatars";
import AccountView from "./accountView";
import ProtokollvorlagenView from "./protocolTemplates/protocolTemplatesView";
import DevicesView from "./devicesView";
import { App } from "../../App";
import { Device } from "../../models/device";
import { CompletedProtocolsView } from "./completedProtocols/completedProtocolsView";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box pl={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    height: "100%",
  },
}));

export default function DashboardPageView() {
  const classes = useStyles();
  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={"main-background"}>
      <div className={"dashboard-sidebar"}>
        <Paper square>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            indicatorColor="secondary"
            textColor="secondary"
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <Tab
              icon={
                /**TODO: Use username */
                <AvatarWithIcon
                  name="Leipziger Verkehrsbetriebe"
                  avatar="/img/avatar/1.jpg"
                  icon={"cog"}
                />
              }
              label="Account"
              className={"dashboard-sidebar-tab"}
              {...a11yProps(0)}
            />
            <Tab
              icon={<FontAwesomeIcon icon={"clipboard-list"} />}
              label="Protokollvorlagen"
              className={"dashboard-sidebar-tab"}
              {...a11yProps(1)}
            />
            <Tab
              icon={<FontAwesomeIcon icon={"clipboard-check"} />}
              label="Ausgefüllte Protokolle"
              {...a11yProps(2)}
            />
            <Tab
              icon={<FontAwesomeIcon icon={"glasses"} />}
              label="Meine Geräte"
              {...a11yProps(3)}
            />
          </Tabs>
        </Paper>
      </div>
      <TabPanel value={value} index={0}>
        <TabPanelContainer>
          <AccountView />
        </TabPanelContainer>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TabPanelContainer>
          <ProtokollvorlagenView />
        </TabPanelContainer>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TabPanelContainer>
          <CompletedProtocolsView />
        </TabPanelContainer>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <TabPanelContainer>
          <DevicesView data={buildDevicesData()} />
        </TabPanelContainer>
      </TabPanel>
    </div>
  );
}

function buildDevicesData() {
  var data: {
    name: string;
    workee: number | undefined;
    lastsync: Date | undefined;
  }[] = [];
  App.user.devices.map((device: Device) => {
    data.push(device.asTableData());
    return device;
  });
  return data;
}

class TabPanelContainer extends React.Component {
  render() {
    return (
      <div
        style={{
          marginLeft: "15rem",
          paddingRight: "1rem",
          overflowY: "auto",
          height: "100%",
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
