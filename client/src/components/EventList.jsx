import React from 'react';
import EventCard from './EventCard';

const EventList = () => {
  const events = [
    {
      title: 'Muslim Couple Friends Meetup 2',
      host: 'Chennai Muslim Couples and Families Meetup',
      date: 'Sun, Oct 27 - 3:30 PM IST',
      attendees: 1,
      location: 'Chennai',
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Building with Generative AI: What You Need to Know',
      host: 'ChennAI Meetup Group',
      date: 'Sat, Sep 21 - 9:30 AM IST',
      attendees: 535,
      location: 'Chennai',
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Advantages of NextJs and Building Microfrontends',
      host: 'Chennai Web Engineering',
      date: 'Sat, Sep 21 - 11:30 AM IST',
      attendees: 89,
      location: 'Chennai',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Events near Saint Thomas Mount, IN</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventList;
