import './App.css';
import './Dropdowns'
import React, {useEffect, useState} from 'react';
import { DropdownEditUser, DropdownCreateEvent, DropdownSignUp, DropdownLogIn, Dropdown } from './Dropdowns';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleDateString('en-US', options);
};

function EventGuests({ eventId }) {
  const [guests, setGuests] = useState([]);

  useEffect(() => {

    // Function to fetch event guests
    const fetchEventGuests = async () => {
      try {
        // Fetch event invites
        const invitesResponse = await fetch(`http://127.0.0.1:8000/api/v1/event-invites/event/${eventId}/`);
        const invites = await invitesResponse.json();
        const guestIds = invites.map(invite => invite.invitee);

        // Fetch guest details
        const usersResponse = await Promise.all(guestIds.map(guestId => fetch(`http://127.0.0.1:8000/api/v1/users/${guestId}/`)));
        const usersData = await Promise.all(usersResponse.map(response => response.json()));
        const usernames = usersData.map(user => user.username);

        // Set state with guest usernames
        setGuests(usernames);
      } catch (error) {
        console.error("Error fetching event guests:", error);
      }
    };

    // Call the function to fetch event guests when component mounts
    fetchEventGuests();
  }, [eventId]);

  return (
    <div className="text">
      <ul className="guest-list">
        <li><h3>Guests:</h3></li>
        <li>
          <ul>
            {guests.map((guest, index) => (
              <li key={index}>{guest}</li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}



function App() {
  const [dropdownContent, setDropdownContent] = useState(null);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch event data from the backend when the component mounts
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/events/`);
      if (!response.ok) {
        throw new Error('Failed to fetch event data');
      }
      const eventData = await response.json();
      setEvents(eventData);
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  const handleButtonClick = (content) => {
    setDropdownContent(content);
  };

  const closeDropdown = () => {
    setDropdownContent(null);
  };

  return (
    <div className="App">
      <header className="header" id="home">
		<div className="container">
			<h1>Welcome to Events!</h1>
			<h2>
				<small>Enjoy your time!</small>
			</h2>
		</div>
	  </header>

	  <nav className="page-navigation">
          <div className="container">
		  	  <ul className = "navigation-link">
		  		  <li><a href="#home">Home</a></li>
				  <li><a href="#contacts">Contacts</a></li>
			  </ul>
		  </div>

          <div className="container">
			  <ul className = "user-navigation">
                  <li><button className="dropbtn" onClick={() => handleButtonClick(<DropdownEditUser closeDropdown={closeDropdown} />)}>Edit user</button></li>
                  <li><button className="dropbtn" onClick={() => handleButtonClick(<DropdownCreateEvent closeDropdown={closeDropdown} />)}>Create Event</button></li>
                  <li><button className="dropbtn" onClick={() => handleButtonClick(<DropdownSignUp closeDropdown={closeDropdown} />)}>Sign Up</button></li>
                  <li><button className="dropbtn" onClick={() => handleButtonClick(<DropdownLogIn closeDropdown={closeDropdown} />)}>Log In</button></li>
			  </ul>
		  </div>
	  </nav>

      <main>
          <h2 className="title">Events Collection</h2>

              {events.map(event => (
          <div key={event.id} className="main-element">
            <div className="content">
              <div className="image">
                {/* Use the default.jpg image from the public folder */}
                <img src="/default.jpg" alt="event image" />
              </div>
              <div className="text">
                <ul className="event-description">
                  <li><h3>Event Description:</h3></li>
                  <li>{event.title}</li>
                  <li>{event.description}</li>
                  <li>{formatDate(event.startDate)}</li>
                  <li>{formatDate(event.endDate)}</li>
                  <li>{event.location}</li>
                </ul>
              </div>
                {/* Render EventGuests component passing the event id */}
                <EventGuests eventId={event.id} />

              {/* Additional content here, e.g., guest list */}
            </div>
          </div>
        ))}

      </main>

      <Dropdown isOpen={!!dropdownContent }>
        {dropdownContent}
      </Dropdown>

	  <footer className="footer" id="contacts">
		  <div className="container">
			  <h2>Our Contacts</h2>
			  <h4>
				  <small>events@gmail.com</small>
			  </h4>
              <h4>
				  <small>+38-033-47-58-698</small>
			  </h4>
		  </div>
	  </footer>

    </div>
  );
}

export default App;
