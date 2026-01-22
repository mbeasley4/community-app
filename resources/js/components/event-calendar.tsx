import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';

const EventCalendar: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
      })
      .catch(err => {
        console.error('Failed to load events:', err);
      });
  }, []);

  const handleDateClick = (arg: DateClickArg) => {
    alert(`Clicked on date: ${arg.dateStr}`);
  };

  return (
    <div className="inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20">
      <h2>Events</h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        dateClick={handleDateClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
      />
    </div>
  );
};

export default EventCalendar;
