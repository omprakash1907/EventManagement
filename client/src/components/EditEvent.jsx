import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditEvent = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState(100);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        const event = response.data;
        setTitle(event.title);
        setDescription(event.description);
        setDate(event.date);
        setLocation(event.location);
        setMaxAttendees(event.maxAttendees);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('location', location);
    formData.append('maxAttendees', maxAttendees);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/events/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/my-events');
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-lg">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-lg">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-lg">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-lg">Max Attendees</label>
          <input
            type="number"
            value={maxAttendees}
            onChange={(e) => setMaxAttendees(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block text-lg">Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;
