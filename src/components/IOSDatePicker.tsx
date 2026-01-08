import { useState } from 'react';

interface IOSDatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
}

const MONTHS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' }
];

const IOSDatePicker = ({ value, onChange }: IOSDatePickerProps) => {
  const parseInitialDate = () => {
    if (value) {
      return {
        day: value.getDate(),
        month: value.getMonth() + 1,
        year: value.getFullYear()
      };
    }
    const now = new Date();
    return {
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear()
    };
  };

  const initial = parseInitialDate();
  const [day, setDay] = useState(initial.day);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const updateDate = (newDay: number, newMonth: number, newYear: number) => {
    try {
      const maxDay = new Date(newYear, newMonth, 0).getDate();
      const validDay = Math.min(newDay, maxDay);
      
      const newDate = new Date(newYear, newMonth - 1, validDay);
      
      // Não permitir datas futuras
      const today = new Date();
      if (newDate > today) {
        return;
      }
      
      onChange(newDate);
      
      if (validDay !== newDay) {
        setDay(validDay);
      }
    } catch (error) {
      console.error('Erro ao atualizar data:', error);
    }
  };

  const handleDayChange = (newDay: number) => {
    setDay(newDay);
    updateDate(newDay, month, year);
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    updateDate(day, newMonth, year);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    updateDate(day, month, newYear);
  };

  const selectClassName = "bg-card border border-border rounded-xl px-3 py-4 text-foreground text-center text-base focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer appearance-none";

  return (
    <div className="flex items-center gap-2">
      {/* Dia */}
      <select
        value={day}
        onChange={(e) => handleDayChange(parseInt(e.target.value))}
        className={`${selectClassName} w-20`}
      >
        {days.map(d => (
          <option key={d} value={d}>{String(d).padStart(2, '0')}</option>
        ))}
      </select>

      {/* Mês */}
      <select
        value={month}
        onChange={(e) => handleMonthChange(parseInt(e.target.value))}
        className={`${selectClassName} flex-1`}
      >
        {MONTHS.map(m => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      {/* Ano */}
      <select
        value={year}
        onChange={(e) => handleYearChange(parseInt(e.target.value))}
        className={`${selectClassName} w-24`}
      >
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
};

export default IOSDatePicker;
