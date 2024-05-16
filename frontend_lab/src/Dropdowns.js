import React, {useEffect, useState} from 'react';
let userId = null;
let isLoggedIn = false;
function DropdownEditUser({ closeDropdown }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const fetchUserData = async () => {
    try {

      const response = await fetch(`http://127.0.0.1:8000/api/v1/users/${userId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const user = await response.json();
      setFormData({
        username: user.username,
        email: user.email,
        password: ''
      });
    } catch (error) {
      alert('Error fetching user data: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCloseDropdown = () => {
    closeDropdown();
  };

  const handleSubmit = async () => {
    try {
      if (!isLoggedIn) {
        throw new Error('Firstly, you need to login');
      }
      const response = await fetch(`http://127.0.0.1:8000/api/v1/users/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Update the placeholders with new information
      fetchUserData();

      alert('User updated successfully!');
    } catch (error) {
      alert('Error updating user: ' + error.message);
    }
  };

  return (
    <div className="form">
      <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required /><br />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /><br />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required /><br />
      <button onClick={handleSubmit}>Confirm</button>
      <button id="CloseButton" onClick={handleCloseDropdown}>Close</button>
    </div>
  );
}

function DropdownCreateEvent({ closeDropdown  }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    selectedUsers: []
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      alert('Firstly, you need to login');
      closeDropdown();
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/users/');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      alert('Error fetching users: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevState => {
      const selectedUsers = checked
        ? [...prevState.selectedUsers, value]
        : prevState.selectedUsers.filter(userId => userId !== value);
      return { ...prevState, selectedUsers };
    });
  };

  const handleCloseDropdown = () => {
    closeDropdown();
  };

  const formatDateTime = (date, time) => {
    const d = new Date(`${date}T${time}`);
    return d.toISOString();
  };

  const handleSubmit = async () => {
    try {
      if (!isLoggedIn) {
        throw new Error('Firstly, you need to login');
      }

      const eventPayload = {
        title: formData.title,
        description: formData.description,
        startDate: formatDateTime(formData.startDate, formData.startTime),
        endDate: formatDateTime(formData.endDate, formData.endTime),
        location: formData.location
      };


      const eventResponse = await fetch('http://127.0.0.1:8000/api/v1/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventPayload)
      });

      if (!eventResponse.ok) {
        const errorText = await eventResponse.text();
        throw new Error(`Failed to create event: ${errorText}`);
      }

      const event = await eventResponse.json();
      const eventId = event.id;

      for (const userId of formData.selectedUsers) {
        const invitePayload = {
          event: eventId,
          invitee: userId
        };


        const inviteResponse = await fetch('http://127.0.0.1:8000/api/v1/event-invites/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(invitePayload)
        });

        if (!inviteResponse.ok) {
          const errorText = await inviteResponse.text();
          throw new Error(`Failed to send invite: ${errorText}`);
        }
      }

      alert('Event created and invites sent successfully!');

      closeDropdown();
    } catch (error) {
      alert('Error creating event: ' + error.message);
    }
  };

  return (
    <div className="form">
      <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required /><br />
      <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required /><br />
      <input type="date" name="startDate" placeholder="Start Date" value={formData.startDate} onChange={handleChange} required /><br />
      <input type="time" name="startTime" placeholder="Start Time" value={formData.startTime} onChange={handleChange} required /><br />
      <input type="date" name="endDate" placeholder="End Date" value={formData.endDate} onChange={handleChange} required /><br />
      <input type="time" name="endTime" placeholder="End Time" value={formData.endTime} onChange={handleChange} required /><br />
      <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required /><br />

      <fieldset>
        <legend>Select Users:</legend>
        {users.map(user => (
          <div key={user.id}>
            <input type="checkbox" id={`user${user.id}`} name="users[]" value={user.id} onChange={handleCheckboxChange} />
            <label htmlFor={`user${user.id}`}>{user.username}</label><br />
          </div>
        ))}
      </fieldset><br />

      <button onClick={handleSubmit}>Confirm</button>
      <button id="CloseButton" onClick={handleCloseDropdown}>Close</button>
    </div>
  );
}
function DropdownSignUp({ closeDropdown }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCloseDropdown = () => {
    closeDropdown();
  };

  const handleSubmit = async () => {
    try {
      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await fetch('http://127.0.0.1:8000/api/v1/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      // Clear form data on successful submission
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Close the dropdown
      closeDropdown();
      alert('User created successfully!');
    } catch (error) {
      alert('Error creating user:' + error.message);
      // Handle error, e.g., display error message to user
    }
  };

  return (
    <div className="form">
      <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required /><br />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /><br />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required /><br />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required /><br />
      <button onClick={handleSubmit}>Confirm</button>
      <button id="CloseButton" onClick={handleCloseDropdown}>Close</button>
    </div>
  );
}

function DropdownLogIn({ closeDropdown }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCloseDropdown = () => {
    closeDropdown();
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/users/');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const userData = await response.json();

      // Check if the user exists
      const user = userData.find(user => user.email === formData.email && user.password === formData.password);
      if (isLoggedIn) {
        throw new Error('You are already logged in!');
      }
      if (!user) {
        throw new Error('User not found');
      }

      // Set global variable to indicate user is logged in
      userId = user.id;
      isLoggedIn = true;

      // Close the dropdown
      closeDropdown();
      alert('Logged in successfully!');
    } catch (error) {
      alert('Error logging in: ' + error.message);
      // Handle error, e.g., display error message to user
    }
  };
  return (
    <div className="form">
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /><br />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required /><br />
      <button onClick={handleSubmit}>Confirm</button>
      <button id="CloseButton" onClick={handleCloseDropdown}>Close</button>
    </div>
  );
}
function Dropdown({ isOpen,  children }) {

  return (
    <div id="dropdown-content" style={{ display: isOpen ? 'block' : 'none', backgroundColor: isOpen ? '#212121' : 'transparent' }}>
      {children}

    </div>
  );
}

export { DropdownEditUser, DropdownCreateEvent, DropdownSignUp, DropdownLogIn, Dropdown };