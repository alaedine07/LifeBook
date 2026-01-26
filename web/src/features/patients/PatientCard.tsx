// src/features/patients/PatientCard.tsx
import type { Patient } from '../../lib/types/types';

type PatientCardProps = {
  patient: Patient;
  onSelect: () => void;
};

export default function PatientCard({ patient, onSelect }: PatientCardProps) {
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer hover:scale-105"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
          {patient.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{patient.name}</h3>
          <p className="text-gray-600 text-sm">{patient.email}</p>
        </div>
      </div>
      <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition">
        View Records
      </button>
    </div>
  );
}
