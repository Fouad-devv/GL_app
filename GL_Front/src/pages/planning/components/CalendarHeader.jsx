import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from '../../../components/Button';

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export const CalendarHeader = ({ currentDate, onPrev, onNext }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold">
      {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
    </h2>
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onPrev}><FiChevronLeft /></Button>
      <Button variant="outline" size="sm" onClick={onNext}><FiChevronRight /></Button>
    </div>
  </div>
);
