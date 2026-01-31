// web/src/features/dashboard/DashboardPage.tsx

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* WIP Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-yellow-800 font-semibold">🚧 Dashboard Under Development</p>
        <p className="text-yellow-700 text-sm mt-1">
          This page is currently being designed. Below is a proposed implementation roadmap.
        </p>
      </div>

      {/* Implementation TODO */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Features Roadmap</h2>

        <div className="space-y-4">
          {/* Section: Overview Metrics */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">📊 Overview Metrics</h3>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Daily Summary Card:</strong> Show total reflections answered, mood entries, and key statistics for the selected date</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Weekly Mood Chart:</strong> Visualize mood trends over the past 7 days (bar/line chart using mood frequency)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Streak Counter:</strong> Display consecutive days with mood/reflection entries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Monthly Overview:</strong> Heat map showing activity levels throughout the month</span>
              </li>
            </ul>
          </div>

          {/* Section: Quick Access */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">⚡ Quick Access & Actions</h3>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Quick Mood Entry:</strong> One-click mood logging from dashboard without navigating to Moods page</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Quick Reflection Answering:</strong> See pending reflections and answer them directly from dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Recent Entries Preview:</strong> Display latest 3-5 mood entries and reflections with timestamps</span>
              </li>
            </ul>
          </div>

          {/* Section: Insights */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">💡 Insights & Analytics</h3>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Mood Patterns:</strong> Identify most common moods and time-based patterns (morning vs evening)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Reflection Insights:</strong> Key themes extracted from reflections (tags/keywords analysis)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Wellness Score:</strong> Composite score based on mood consistency and reflection completion</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Therapist Notes Integration:</strong> Highlight areas therapist flagged based on user's moods and reflections</span>
              </li>
            </ul>
          </div>

          {/* Section: Date Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">📅 Date Navigation</h3>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Date Range Selector:</strong> Allow viewing dashboard for specific date ranges (week/month/custom)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Time Period Comparison:</strong> Compare current period metrics with previous period</span>
              </li>
            </ul>
          </div>

          {/* Section: Customization */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">⚙️ Dashboard Customization</h3>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Widget Arrangement:</strong> Allow users to drag and customize which metrics appear on dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Dark Mode Support:</strong> Ensure all dashboard components work in dark theme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">☐</span>
                <span className="text-gray-700"><strong>Export Data:</strong> Allow exporting dashboard insights as PDF or CSV</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
