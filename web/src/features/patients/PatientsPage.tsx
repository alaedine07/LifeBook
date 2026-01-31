// web/src/features/patients/PatientsPage.tsx
import { useState } from 'react';
import type { Patient } from '../../lib/types/types';
import PatientDetail from './PatientDetail';
import PatientCard from './PatientCard';
import { useFetchPatients } from '../../hooks/useTherapists';

interface PatientWithId extends Patient {
  id: number;
}

export default function PatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState<PatientWithId | null>(null);
  const [patientDate, setPatientDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { data: patients = [], isLoading } = useFetchPatients();

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

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-12 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading your patients...</p>
          </div>
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg">No patients added yet.</p>
          <p className="text-gray-500 text-sm mt-2">Your patients will appear here once they add you as their therapist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {patients.map((link: any) => (
            <PatientCard
              key={link.userId}
              patient={{
                name: link.user.username,
                email: link.user.email,
              }}
              onSelect={() =>
                setSelectedPatient({
                  id: link.userId,
                  name: link.user.username,
                  email: link.user.email,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
