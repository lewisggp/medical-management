'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import useDoctors from '@/hooks/useDoctor';
import DoctorTable from '@/components/dashboard/doctor/DoctorTable';
import DoctorModal from '@/components/dashboard/doctor/DoctorModal';
import DeleteConfirmationModal from '@/components/dashboard/doctor/DeleteDoctor';
import { Doctor } from '@/generated/prisma';
import { specialties } from '@/lib/doctor-specialties';

const DoctorManagement = () => {
  const { doctors, isLoading, mutate } = useDoctors();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('');
  const [action, setAction] = useState<'create' | 'edit' | 'view'>('create');

  const filteredDoctors = doctors.filter(
    (doctor) =>
      (doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (specialtyFilter === '' || doctor.specialty === specialtyFilter)
  );

  const handleOpenCreate = () => {
    setAction('create');
    setSelectedDoctor(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (doctor: Doctor) => {
    setAction('edit');
    setSelectedDoctor(doctor);
    setOpenModal(true);
  };

  const handleOpenView = (doctor: Doctor) => {
    setAction('view');
    setSelectedDoctor(doctor);
    setOpenModal(true);
  };

  const handleOpenDelete = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setOpenDeleteModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDoctor(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedDoctor(null);
  };

  const handleDelete = async () => {
    if (!selectedDoctor) return;
    try {
      await fetch(`/api/doctors/${selectedDoctor.id}`, {
        method: 'DELETE'
      });
      mutate();
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Doctores
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
          Agregar Doctor
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Buscar doctores..."
          InputProps={{
            startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Especialidad {specialtyFilter}</InputLabel>
          <Select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value as string)} label="Especialidad">
            <MenuItem value="">Todas las especialidades</MenuItem>
            {specialties.map((specialty) => (
              <MenuItem key={specialty} value={specialty}>
                {specialty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <DoctorTable doctors={filteredDoctors} onEdit={handleOpenEdit} onView={handleOpenView} onDelete={handleOpenDelete} isLoading={isLoading} />

      <DoctorModal open={openModal} onClose={handleCloseModal} doctor={selectedDoctor} action={action} onSuccess={mutate} />

      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="¿Estás seguro?"
        message={`Estás a punto de eliminar al doctor ${selectedDoctor?.name}. Esta acción no se puede deshacer.`}
      />
    </Box>
  );
};

export default DoctorManagement;
