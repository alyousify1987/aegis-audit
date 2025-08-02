// src/components/ReportingAnalyticsHub.tsx

import { useEffect } from 'react';
import { Box, Typography, CircularProgress, Grid, Paper } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useDocumentStore } from '../store/document.store';
import { EmptyState } from './EmptyState';

const PIE_COLORS: { [key: string]: string } = {
  Published: '#4caf50',
  Draft: '#ff9800',
  Archived: '#9e9e9e',
};

// Custom Tooltip for a more professional look
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const isPie = !label;
    // For the stacked bar, we are interested in the second payload item (the blue bar)
    const data = isPie ? payload[0] : payload[1]; 
    if (!data) return null; // Safety check

    const finalLabel = isPie ? data.name : label;
    const finalValue = data.value;
    const finalName = data.name;
    const finalColor = isPie ? data.payload.fill : data.fill;

    return (
      <Paper elevation={4} sx={{ p: 1.5, bgcolor: '#333' }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{`${finalLabel}`}</Typography>
        <Typography variant="body2" sx={{ color: finalColor }}>
          {`${finalName}: ${finalValue}`}
        </Typography>
      </Paper>
    );
  }
  return null;
};

export function ReportingAnalyticsHub() {
  const { documents, isLoading, fetchDocuments } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // THIS IS THE FULL, CORRECT CODE FOR DERIVING CHART DATA
  const pieChartData = documents.reduce((acc, doc) => {
    const status = acc.find(item => item.name === doc.status);
    if (status) {
      status.value += 1;
    } else {
      acc.push({ name: doc.status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);
  
  const barChartData = (() => {
    if (documents.length === 0) return [];
    const ownerMap = documents.reduce((acc, doc) => {
      acc.set(doc.owner, (acc.get(doc.owner) || 0) + 1);
      return acc;
    }, new Map<string, number>());
    const maxCount = Math.max(...Array.from(ownerMap.values()));
    return Array.from(ownerMap.entries()).map(([name, count]) => ({
      name,
      count,
      backgroundCount: maxCount - count, // background is the remaining value
    }));
  })();

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Reporting & Analytics Dashboard</Typography>
      
      {isLoading ? ( <CircularProgress /> ) : (
        documents.length === 0 ? (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 2, height: 400, display: 'flex' }}>
            <EmptyState 
              title="No Data to Display" 
              message="Add some documents or seed the database to see your analytics." 
            />
          </Paper>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" align="center" sx={{ mb: 1 }}>Documents by Status</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" />
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" labelLine={false}>
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name] || '#8884d8'} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
               <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" align="center" sx={{ mb: 1 }}>Documents by Owner</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} layout="vertical" margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <YAxis type="category" dataKey="name" stroke="#e0e0e0" axisLine={false} tickLine={false} />
                    <XAxis type="number" hide domain={[0, 'dataMax']} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                    <Bar dataKey="count" fill="#7df9ff" name="Number of Documents" radius={8} stackId="a" barSize={20} />
                    <Bar dataKey="backgroundCount" fill="#333" radius={8} stackId="a" isAnimationActive={false} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        )
      )}
    </Box>
  );
}