// src/features/patients/PatientDetail.tsx
import type { Patient } from '../../lib/types/types';

type PatientDetailProps = {
  patient: Patient;
  patientDate: string;
  setPatientDate: (date: string) => void;
  onBack: () => void;
};

export default function PatientDetail({
  patient,
  patientDate,
  setPatientDate,
  onBack,
}: PatientDetailProps) {
  // Dummy data shown in original code - in real app this would come from props/store/API
  const dummyReflections = [
    { question: 'How was your mood today?', answer: 'Yes' },
    { question: 'Rate your anxiety level (1-10)', answer: '7' },
    { question: 'What made you happy today?', answer: 'Spending time with friends' },
  ];

  const dummyMoods = [
    { type: 'happy', notes: 'Had a great day at work', emoji: '😊' },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-indigo-600 hover:text-indigo-700 font-bold"
      >
        ← Back to Patients
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{patient.name}</h2>
        <p className="text-gray-600 mb-4">{patient.email}</p>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={patientDate}
            onChange={(e) => setPatientDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Reflections for {patientDate}
        </h3>
        <div className="space-y-4">
          {dummyReflections.map((ref, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                index === 0
                  ? 'bg-blue-50 border-blue-500'
                  : index === 1
                  ? 'bg-purple-50 border-purple-500'
                  : 'bg-green-50 border-green-500'
              }`}
            >
              <p className="font-semibold text-gray-800">{ref.question}</p>
              <p className="text-gray-600 mt-1">{ref.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Moods for {patientDate}
        </h3>
        <div className="space-y-3">
          {dummyMoods.map((mood, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
              <span className="text-3xl">{mood.emoji}</span>
              <div>
                <p className="font-semibold text-gray-800 capitalize">{mood.type}</p>
                <p className="text-sm text-gray-600">{mood.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
