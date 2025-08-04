// src/components/AddAuditModal.tsx
import { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, Stack, Select, MenuItem, FormControl, InputLabel, Alert, CircularProgress } from '@mui/material';
import { useAuditStore } from '../store/audit.store';
import type { IAudit } from '../services/db.service';

interface AddAuditModalProps {
  open: boolean;
  onClose: () => void;
}

type AuditFormErrors = {
  auditName?: string;
  scheduledDate?: string;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

export function AddAuditModal({ open, onClose }: AddAuditModalProps) {
  const { addAudit } = useAuditStore();
  const [auditName, setAuditName] = useState('');
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    auditName?: string;
    scheduledDate?: string;
  }>({});

  // Reset form when modal is closed
  const resetForm = () => {
    setAuditName('');
    setRiskLevel('Low');
    setScheduledDate('');
    setError(null);
    setFormErrors({});
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const errors: AuditFormErrors = {};
    
    // Validate audit name
    if (!auditName.trim()) {
      errors.auditName = 'Audit name is required';
    } else if (auditName.length < 3) {
      errors.auditName = 'Audit name must be at least 3 characters';
    } else if (auditName.length > 100) {
      errors.auditName = 'Audit name must be less than 100 characters';
    }

    // Validate scheduled date
    if (!scheduledDate) {
      errors.scheduledDate = 'Scheduled date is required';
    } else {
      try {
        const selectedDate = new Date(scheduledDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (isNaN(selectedDate.getTime())) {
          errors.scheduledDate = 'Invalid date format';
        } else if (selectedDate < today) {
          errors.scheduledDate = 'Scheduled date cannot be in the past';
        }
      } catch (err) {
        errors.scheduledDate = 'Invalid date format';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Parse the date string to ensure it's valid
      const parsedDate = new Date(scheduledDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }

      const newAudit: Omit<IAudit, 'id'> = {
        auditName: auditName.trim(),
        riskLevel,
        scheduledDate: parsedDate,
        status: 'Planned'
      };

      await addAudit(newAudit);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create audit');
    } finally {
      setIsLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      aria-labelledby="add-audit-modal-title"
    >
      <Box sx={style}>
        <Typography id="add-audit-modal-title" variant="h6" component="h2">
          Plan New Audit
        </Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField 
            id="audit-name" 
            label="Audit Name / Title" 
            variant="outlined" 
            value={auditName} 
            onChange={(e) => setAuditName(e.target.value)}
            onBlur={() => validateForm()}
            error={!!formErrors.auditName}
            helperText={formErrors.auditName}
            fullWidth 
            required 
          />
          
          <FormControl fullWidth>
            <InputLabel id="audit-risk-level-label">Risk Level</InputLabel>
            <Select
              labelId="audit-risk-level-label"
              id="audit-risk-level-select"
              value={riskLevel}
              label="Risk Level"
              onChange={(e) => setRiskLevel(e.target.value as 'Low' | 'Medium' | 'High')}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          
          <TextField 
            id="audit-scheduled-date" 
            label="Scheduled Date" 
            type="date" 
            value={scheduledDate} 
            onChange={(e) => {
              setScheduledDate(e.target.value);
              // Validate immediately on change
              const date = new Date(e.target.value);
              if (isNaN(date.getTime())) {
                setFormErrors(prev => ({ ...prev, scheduledDate: 'Invalid date format' }));
              } else {
                setFormErrors(prev => ({ ...prev, scheduledDate: undefined }));
              }
            }}
            onBlur={() => validateForm()}
            error={!!formErrors.scheduledDate}
            helperText={formErrors.scheduledDate}
            InputLabelProps={{ shrink: true }} 
            inputProps={{ 
              min: today,
              'aria-label': 'Select audit date'
            }}
            fullWidth 
            required
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button 
              onClick={handleClose} 
              variant="outlined" 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Saving...' : 'Save Audit'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}