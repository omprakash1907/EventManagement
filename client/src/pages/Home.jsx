import React, { useState, useEffect } from 'react';
import EventList from '../components/EventList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [locations, setLocations] = useState([]); // State to store unique locations

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('https://eventmanagement-ksbh.onrender.com/api/events');
        const allEvents = response.data;
        const uniqueLocations = [...new Set(allEvents.map(event => event.location))];
        setLocations(uniqueLocations); // Store unique locations
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filter Bar */}
      <div className="bg-white shadow-md py-6 px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center w-full md:w-1/3">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search for event"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 p-2 rounded focus:outline-none"
            />
          </div>
          <div className="flex items-center w-full md:w-1/3">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-2" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-gray-100 p-2 rounded focus:outline-none"
            >
              <option value="">Event Location</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center w-full md:w-1/3">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-100 p-2 rounded focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-8">
        <div className="text-center my-12">
          {user ? (
            <>
              <h1 className="text-4xl font-bold">Welcome, {user.name} 👋</h1>
              <p className="mt-4 text-gray-600">Here are your upcoming events:</p>

              {/* Buttons for viewing and creating events */}
              <div className="flex justify-center space-x-4 mt-8">
                <Link to="/my-events">
                  <button className="bg-blue-500 text-white py-2 px-4 rounded flex items-center space-x-2">
                    <span>View My Events</span>
                  </button>
                </Link>
                <Link to="/create-event">
                  <button className="bg-green-500 text-white py-2 px-4 rounded flex items-center space-x-2">
                    <span>Create Event</span>
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold">Join and Discover Events Near You</h1>
              <p className="mt-4 text-gray-600">Sign up to join the fun.</p>
              <button className="bg-teal-500 text-white py-2 px-4 rounded mt-4">Join Now</button>
            </>
          )}
        </div>

        {/* Event List */}
        <EventList searchTerm={searchTerm} location={location} date={date} />
      </div>
    </div>
  );
};

export default Home;
