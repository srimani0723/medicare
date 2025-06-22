import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { GetDailyStreak } from "../middlewares/fetchData";
import './calender.css';


const StreakCalendar = () => {
  const { data: dailyStreak } = GetDailyStreak();

    const highlightDates = dailyStreak
        ? dailyStreak
        : [];

  return (
      <Calendar
      tileClassName={({ date }) => {
        const iso = date.toLocaleDateString('en-CA');
        
        return highlightDates.includes(iso)
          ? "green-highlight "
          : "";
      }}
    />
  );
};

export default StreakCalendar