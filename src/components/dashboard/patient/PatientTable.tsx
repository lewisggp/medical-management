'use client';

import { Patient } from '@/generated/prisma';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  IconButton,
  Box,
  Tooltip,
  Typography
} from '@mui/material';

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onView: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  isLoading: boolean;
}

const PatientTable = ({ patients, onEdit, onView, onDelete, isLoading }: PatientTableProps) => {
  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[...Array(7)].map((_, index) => (
                <TableCell key={index} sx={{ borderBottomColor: 'primary.main' }}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {[...Array(7)].map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Nombre</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Correo</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Teléfono</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Fecha de Nacimiento</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Tipo de Sangre</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Alergias</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No se encontraron pacientes
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
                <TableCell>{patient.bloodType}</TableCell>
                <TableCell>
                  <Tooltip title={patient.allergies || 'Sin alergias'}>
                    <Typography
                      sx={{
                        maxWidth: 150,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {patient.allergies || 'Sin alergias'}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="info" onClick={() => onView(patient)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => onEdit(patient)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(patient)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientTable;
