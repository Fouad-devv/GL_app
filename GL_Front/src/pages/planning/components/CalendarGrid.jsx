const DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export const CalendarGrid = ({ weeks, getInterventionsForDay, onInterventionClick }) => (
  <>
    <div className="grid grid-cols-7 gap-1 mb-1">
      {DAY_NAMES.map((day) => (
        <div key={day} className="text-center font-bold text-gray-700 py-2">{day}</div>
      ))}
    </div>
    <div className="space-y-1">
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx} className="grid grid-cols-7 gap-1">
          {week.map((day, dayIdx) => {
            const dayInterventions = day ? getInterventionsForDay(day) : [];
            return (
              <div
                key={dayIdx}
                className={`min-h-[120px] p-2 border rounded-lg ${day ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-100'}`}
              >
                {day && (
                  <>
                    <p className="font-bold text-gray-900">{day}</p>
                    <div className="mt-2 space-y-1">
                      {dayInterventions.slice(0, 2).map((intervention, idx) => (
                        <div
                          key={idx}
                          onClick={() => onInterventionClick(intervention)}
                          className={`text-xs p-1 rounded text-white truncate ${
                            intervention.status === 'PLANIFIEE' ? 'bg-blue-500' :
                            intervention.status === 'EN_COURS'  ? 'bg-yellow-500' :
                            intervention.status === 'TERMINEE'  ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        >
                          {intervention.machineName}
                        </div>
                      ))}
                      {dayInterventions.length > 2 && (
                        <p className="text-xs text-gray-500">+{dayInterventions.length - 2} plus</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </>
);
