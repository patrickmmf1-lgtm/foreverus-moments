import { useState, useEffect } from 'react';

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
  const currentDate = value || new Date();
  const [day, setDay] = useState(currentDate.getDate());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Atualizar a data quando os valores mudam
  useEffect(() => {
    const maxDay = new Date(year, month, 0).getDate();
    const validDay = Math.min(day, maxDay);
    const newDate = new Date(year, month - 1, validDay);
    
    // Não permitir datas futuras
    const today = new Date();
    if (newDate > today) {
      return;
    }
    
    onChange(newDate);
  }, [day, month, year, onChange]);

  // Sincronizar com value externo
  useEffect(() => {
    if (value) {
      setDay(value.getDate());
      setMonth(value.getMonth() + 1);
      setYear(value.getFullYear());
    }
  }, [value]);

  const selectClassName = "bg-card border border-border rounded-xl px-3 py-4 text-foreground text-center text-base focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer appearance-none";

  return (
    <div className="flex items-center gap-2">
      {/* Dia */}
      <select
        value={day}
        onChange={(e) => setDay(parseInt(e.target.value))}
        className={`${selectClassName} w-20`}
      >
        {days.map(d => (
          <option key={d} value={d}>{String(d).padStart(2, '0')}</option>
        ))}
      </select>

      {/* Mês */}
      <select
        value={month}
        onChange={(e) => setMonth(parseInt(e.target.value))}
        className={`${selectClassName} flex-1`}
      >
        {MONTHS.map(m => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      {/* Ano */}
      <select
        value={year}
        onChange={(e) => setYear(parseInt(e.target.value))}
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
