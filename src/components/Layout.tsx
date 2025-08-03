// src/components/Layout.tsx

import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Divider, Button } from '@mui/material';
import { useUserStore } from '../store/user.store';
import { useAuditStore } from '../store/audit.store';
import { DocumentControlHub } from './DocumentControlHub';
import { AuditManagementHub } from './AuditManagementHub';
import { NcrCapaHub } from './NcrCapaHub';
import { ReportingAnalyticsHub } from './ReportingAnalyticsHub';
import { ObjectivesKpiHub } from './ObjectivesKpiHub';
import { ExternalAuditorHub } from './ExternalAuditorHub';
import { ManagementReviewHub } from './ManagementReviewHub';
import { SettingsAdminHub } from './SettingsAdminHub';
import { AuditDetails } from './AuditDetails';

// --- THE FIX IS HERE ---
// We explicitly define the type for a nav item, including the optional 'disabled' property.
interface NavItem {
  id: string;
  label: string;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { id: 'docs', label: 'Document Control' },
  { id: 'audits', label: 'Audit Management' },
  { id: 'ncrs', label: 'Non-Conformances' },
  { id: 'analytics', label: 'Analytics Dashboard' },
  { id: 'kpis', label: 'Objectives & KPIs' },
  { id: 'external', label: 'External Audits', disabled: true },
  { id: 'mrm', label: 'Management Reviews', disabled: true },
  { id: 'settings', label: 'Settings', disabled: true },
];
// --- END OF THE FIX ---

const drawerWidth = 240;

function ActiveView({ viewId }: { viewId: string }) {
  const { selectedAudit } = useAuditStore();

  if (viewId === 'audits' && selectedAudit) {
    return <AuditDetails />;
  }

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
      <Box
        component="nav"
        sx={{ width: drawerWidth, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255, 255, 255, 0.12)', bgcolor: 'background.paper' }}
      >
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" component="h1" color="primary">Aegis Audit</Typography>
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton selected={activeView === item.id} onClick={() => setActiveView(item.id)} disabled={item.disabled}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
            <Typography variant="body2">Logged in as:</Typography>
            <Typography fontWeight="bold">{username}</Typography>
            <Button onClick={logout} variant="outlined" size="small" fullWidth sx={{ mt: 1 }}>Logout</Button>
        </Box>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, height: '100vh', overflowY: 'auto' }}>
        <ActiveView viewId={activeView} />
      </Box>
    </Box>
  );
}