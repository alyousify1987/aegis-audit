// src/components/ReportingAnalyticsHub.tsx

import { useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Button, Stack, Card, CardContent, Divider } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useDocumentStore } from '../store/document.store';
import { useAuditStore } from '../store/audit.store';
import { useNcrStore } from '../store/ncr.store';
import { useCapaStore } from '../store/capa.store';
import { EmptyState } from './EmptyState';

const PIE_COLORS: { [key: string]: string } = {
  Published: '#4caf50',
  Draft: '#ff9800',
  Archived: '#9e9e9e',
};

// A custom, styled tooltip for a more professional look
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    if (!data) return null;
    return (
      <Paper elevation={4} sx={{ p: 1.5, bgcolor: '#333' }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{label || data.name}</Typography>
        <Typography variant="body2" sx={{ color: data.fill }}>
          {`${data.name}: ${data.value}`}
        </Typography>
      </Paper>
    );
  }
  return null;
};

export function ReportingAnalyticsHub() {
  const { documents, isLoading, fetchDocuments } = useDocumentStore();
  const { audits } = useAuditStore();
  const { ncrs } = useNcrStore();
  // Defensive: use empty array if capas property is missing
  const capaStore = useCapaStore();
  const capas = Array.isArray((capaStore as any).capas) ? (capaStore as any).capas : [];

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  // Metrics
  const metrics = [
    { label: 'Audits', value: audits?.length || 0, color: 'primary.main' },
    { label: 'NCRs', value: ncrs?.length || 0, color: 'error.main' },
    { label: 'CAPAs', value: capas?.length || 0, color: 'warning.main' },
    { label: 'Documents', value: documents?.length || 0, color: 'info.main' },
  ];

  // Quick actions (stub handlers)
  const quickActions = [
    { label: 'Start Audit', onClick: () => alert('Start Audit (to be implemented)') },
    { label: 'Add Document', onClick: () => alert('Add Document (to be implemented)') },
    { label: 'Report NCR', onClick: () => alert('Report NCR (to be implemented)') },
  ];

  // Recent activity (stub)
  const recentActivity = [
    { type: 'audit', text: 'Audit "QMS-2025" completed', date: '2025-08-01' },
    { type: 'ncr', text: 'NCR #123 opened', date: '2025-07-30' },
    { type: 'doc', text: 'Document "Policy.pdf" uploaded', date: '2025-07-29' },
  ];

  // Chart data
  const pieChartData = documents.reduce((acc, doc) => {
    const status = acc.find(item => item.name === doc.status);
    if (status) { status.value += 1; } else { acc.push({ name: doc.status, value: 1 }); }
    return acc;
  }, [] as { name: string; value: number }[]);
  const barChartData = documents.reduce((acc, doc) => {
    const owner = acc.find(item => item.name === doc.owner);
    if (owner) { owner.count += 1; } else { acc.push({ name: doc.owner, count: 1 }); }
    return acc;
  }, [] as { name: string; count: number }[]);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Reporting & Analytics Dashboard</Typography>

      {/* Metrics */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        {metrics.map((m) => (
          <Card key={m.label} sx={{ flex: 1, borderRadius: 2, boxShadow: 2, bgcolor: 'background.paper', minWidth: 0 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">{m.label}</Typography>
              <Typography variant="h4" sx={{ color: m.color, fontWeight: 700 }}>{m.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Quick Actions */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        {quickActions.map((action) => (
          <Button key={action.label} variant="contained" color="primary" onClick={action.onClick} sx={{ borderRadius: 2, fontWeight: 700 }}>
            {action.label}
          </Button>
        ))}
      </Stack>

      {/* Main Charts & Recent Activity */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ flex: 2, minWidth: 0 }}>
          {isLoading ? (<CircularProgress />) : (
            documents.length === 0 ? (
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 2, height: 400, display: 'flex' }}>
                <EmptyState 
                  title="No Data to Display" 
                  message="Add some documents or seed the database to see your analytics." 
                />
              </Paper>
            ) : (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" align="center" sx={{ mb: 1 }}>Documents by Status</Typography>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" />
                        <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" labelLine={false}>
                          {pieChartData.map((entry: { name: string }, index: number) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name] || '#8884d8'} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: 400, display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
                    <Typography variant="h6" align="center" sx={{ mb: 1 }}>Documents by Owner</Typography>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartData} layout="vertical" margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                        <YAxis type="category" dataKey="name" stroke="#e0e0e0" axisLine={false} tickLine={false} width={80} />
                        <XAxis type="number" hide domain={[0, 'dataMax']} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                        <Bar 
                          dataKey="count" 
                          fill="#7df9ff" 
                          name="Number of Documents" 
                          radius={8} 
                          barSize={20}
                          background={{ fill: '#333', radius: 8 }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Box>
              </Stack>
            )
          )}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
            <Divider sx={{ mb: 1 }} />
            {recentActivity.map((item, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">{item.date}</Typography>
                <Typography variant="body1">{item.text}</Typography>
              </Box>
            ))}
            {recentActivity.length === 0 && (
              <Typography variant="body2" color="text.secondary">No recent activity.</Typography>
            )}
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
