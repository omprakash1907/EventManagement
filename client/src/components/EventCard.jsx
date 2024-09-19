import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="border rounded-lg shadow-md p-4">
      <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-md" />
      <h3 className="text-xl font-bold mt-4">{event.title}</h3>
      <p className="text-gray-600">{event.host}</p>
      <p className="text-sm text-gray-500">{event.date}</p>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">{event.attendees} going</p>
        <p className="text-sm text-gray-600">{event.location}</p>
      </div>
    </div>
  );
};

export default EventCard;
