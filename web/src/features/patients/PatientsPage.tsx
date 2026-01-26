// web/src/features/patients/PatientsPage.tsx
import { useState } from 'react';
import type { Patient } from '../../lib/types/types';
import PatientCard from './PatientCard';
import PatientDetail from './PatientDetail';

type PatientsPageProps = {
  patients: Patient[];
};

export default function PatientsPage({ patients }: PatientsPageProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientDate, setPatientDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  if (selectedPatient) {
    return (
      <PatientDetail
        patient={selectedPatient}
        patientDate={patientDate}
        setPatientDate={setPatientDate}
        onBack={() => setSelectedPatient(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Patients</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onSelect={() => setSelectedPatient(patient)}
          />
        ))}
      </div>
    </div>
  );
}
