'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Chip, Stack } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import usePatients from '@/hooks/usePatient';
import PatientTable from '@/components/dashboard/patient/PatientTable';
import PatientModal from '@/components/dashboard/patient/PatientModal';
import DeleteConfirmationModal from '@/components/dashboard/patient/DeletePatient';
import { Patient } from '@/generated/prisma';
import { bloodTypes } from '@/lib/blood-types';

const PatientManagement = () => {
  const { patients, isLoading, mutate } = usePatients();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>('');
  const [allergiesFilter, setAllergiesFilter] = useState<string>('all');
  const [action, setAction] = useState<'create' | 'edit' | 'view'>('create');

  const filteredPatients = patients.filter((patient) => {
    // Filtro por búsqueda general
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.allergies && patient.allergies.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtro por tipo de sangre
    const matchesBloodType = bloodTypeFilter === '' || patient.bloodType === bloodTypeFilter;

    // Filtro por alergias
    let matchesAllergies = true;
    if (allergiesFilter === 'with') {
      matchesAllergies = !!patient.allergies && patient.allergies.trim() !== '';
    } else if (allergiesFilter === 'without') {
      matchesAllergies = !patient.allergies || patient.allergies.trim() === '';
    }

    return matchesSearch && matchesBloodType && matchesAllergies;
  });

  const handleOpenCreate = () => {
    setAction('create');
    setSelectedPatient(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (patient: Patient) => {
    setAction('edit');
    setSelectedPatient(patient);
    setOpenModal(true);
  };

  const handleOpenView = (patient: Patient) => {
    setAction('view');
    setSelectedPatient(patient);
    setOpenModal(true);
  };

  const handleOpenDelete = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenDeleteModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPatient(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedPatient(null);
  };

  const handleDelete = async () => {
    if (!selectedPatient) return;
    try {
      await fetch(`/api/patients/${selectedPatient.id}`, {
        method: 'DELETE'
      });
      mutate();
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Pacientes
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
          Agregar Paciente
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Buscar pacientes..."
          InputProps={{
            startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Tipo de sangre</InputLabel>
          <Select value={bloodTypeFilter} onChange={(e) => setBloodTypeFilter(e.target.value as string)} label="Tipo de sangre">
            <MenuItem value="">Todos los tipos</MenuItem>
            {bloodTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Alergias</InputLabel>
          <Select value={allergiesFilter} onChange={(e) => setAllergiesFilter(e.target.value as string)} label="Alergias">
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="with">Con alergias</MenuItem>
            <MenuItem value="without">Sin alergias</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1}>
          {bloodTypeFilter && <Chip label={`Sangre: ${bloodTypeFilter}`} onDelete={() => setBloodTypeFilter('')} />}
          {allergiesFilter !== 'all' && (
            <Chip label={`Alergias: ${allergiesFilter === 'with' ? 'Con' : 'Sin'}`} onDelete={() => setAllergiesFilter('all')} />
          )}
        </Stack>
      </Box>

      <PatientTable patients={filteredPatients} onEdit={handleOpenEdit} onView={handleOpenView} onDelete={handleOpenDelete} isLoading={isLoading} />

      <PatientModal open={openModal} onClose={handleCloseModal} patient={selectedPatient} action={action} onSuccess={mutate} />

      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="¿Estás seguro?"
        message={`Estás a punto de eliminar al paciente ${selectedPatient?.name}. Esta acción no se puede deshacer.`}
      />
    </Box>
  );
};

export default PatientManagement;
