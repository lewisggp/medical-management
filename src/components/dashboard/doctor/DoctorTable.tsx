'use client';

import { Doctor } from '@/generated/prisma';
import { Delete } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import { Visibility } from '@mui/icons-material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, Chip, IconButton, Box } from '@mui/material';

interface DoctorTableProps {
  doctors: Doctor[];
  onEdit: (doctor: Doctor) => void;
  onView: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
  isLoading: boolean;
}

const DoctorTable = ({ doctors, onEdit, onView, onDelete, isLoading }: DoctorTableProps) => {
  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[...Array(6)].map((_, index) => (
                <TableCell key={index} sx={{ borderBottomColor: 'primary.main' }}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {[...Array(6)].map((_, cellIndex) => (
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
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Especialidad</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Teléfono</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Licencia</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {doctors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No se encontraron doctores
              </TableCell>
            </TableRow>
          ) : (
            doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>
                  <Chip label={doctor.specialty} color="primary" size="small" />
                </TableCell>
                <TableCell>{doctor.phone}</TableCell>
                <TableCell>{doctor.license}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="info" onClick={() => onView(doctor)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => onEdit(doctor)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(doctor)}>
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

export default DoctorTable;
