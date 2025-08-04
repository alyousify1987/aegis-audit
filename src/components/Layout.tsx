// src/components/Layout.tsx
import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Divider, Button, Avatar, Tooltip } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import GroupIcon from '@mui/icons-material/Group';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsIcon from '@mui/icons-material/Settings';
import { useUserStore } from '../store/user.store';
import { useAuditStore } from '../store/audit.store';
import { useNcrStore } from '../store/ncr.store';
import { DocumentControlHub } from './DocumentControlHub';
import { AuditManagementHub } from './AuditManagementHub';
import { NcrCapaHub } from './NcrCapaHub';
import { ReportingAnalyticsHub } from './ReportingAnalyticsHub';
import { ObjectivesKpiHub } from './ObjectivesKpiHub';
import { ExternalAuditorHub } from './ExternalAuditorHub';
import { ManagementReviewHub } from './ManagementReviewHub';
import { SettingsAdminHub } from './SettingsAdminHub';
import { AuditDetails } from './AuditDetails';
import { NcrDetails } from './NcrDetails';
interface NavItem { id: string; label: string; disabled?: boolean; }
const navItems: (NavItem & { icon: React.ReactNode })[] = [
  { id: 'docs', label: 'Document Control', icon: <DescriptionIcon /> },
  { id: 'audits', label: 'Audit Management', icon: <AssignmentIcon /> },
  { id: 'ncrs', label: 'Non-Conformances', icon: <ReportProblemIcon /> },
  { id: 'analytics', label: 'Analytics Dashboard', icon: <BarChartIcon /> },
  { id: 'kpis', label: 'Objectives & KPIs', icon: <TrackChangesIcon /> },
  { id: 'external', label: 'External Audits', icon: <GroupIcon />, disabled: true },
  { id: 'mrm', label: 'Management Reviews', icon: <ManageAccountsIcon />, disabled: true },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon />, disabled: true },
];
const drawerWidth = 240;
function ActiveView({ viewId }: { viewId: string }) {
  const { selectedAudit } = useAuditStore();
  const { selectedNcr } = useNcrStore();
  if (viewId === 'audits' && selectedAudit) { return <AuditDetails />; }
  if (viewId === 'ncrs' && selectedNcr) { return <NcrDetails />; }
  switch (viewId) {
    case 'docs': return <DocumentControlHub />;
    case 'audits': return <AuditManagementHub />;
    case 'ncrs': return <NcrCapaHub />;
    case 'analytics': return <ReportingAnalyticsHub />;
    case 'kpis': return <ObjectivesKpiHub />;
    case 'external': return <ExternalAuditorHub />;
    case 'mrm': return <ManagementReviewHub />;
    case 'settings': return <SettingsAdminHub />;
    default: return <DocumentControlHub />;
  }
}
export function MainLayout() {
  const [activeView, setActiveView] = useState('docs');
  const { username, logout } = useUserStore();
  return (
    <Box sx={{ display: 'flex' }}>
      <Box component="nav" sx={{ width: drawerWidth, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255, 255, 255, 0.12)', bgcolor: 'background.paper', minHeight: '100vh', boxShadow: 2 }}>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src="/vite.svg" alt="Aegis Audit Logo" style={{ height: 36, width: 36, borderRadius: 8 }} />
          <Typography variant="h5" component="h1" color="primary" fontWeight={700} letterSpacing={1}>
            Aegis Audit
          </Typography>
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <Tooltip title={item.label} placement="right" arrow>
                <ListItemButton selected={activeView === item.id} onClick={() => setActiveView(item.id)} disabled={item.disabled} sx={{ gap: 2 }}>
                  {item.icon}
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>{username?.[0] || 'U'}</Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary">Logged in as</Typography>
            <Typography fontWeight="bold">{username}</Typography>
            <Button onClick={logout} variant="outlined" size="small" fullWidth sx={{ mt: 1 }}>Logout</Button>
          </Box>
        </Box>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, height: '100vh', overflowY: 'auto' }}>
        <ActiveView viewId={activeView} />
      </Box>
    </Box>
  );
}