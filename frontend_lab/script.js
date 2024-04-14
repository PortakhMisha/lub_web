function fetchEvents() {
    fetch("http://127.0.0.1:8000/api/v1/events/")
        .then(response => response.json())
        .then(data => {
            const dataContainer = document.getElementById("data-container-events");
            dataContainer.innerHTML = "";
            data.forEach(event => {
                const eventElement = document.createElement("div");
                eventElement.innerHTML = JSON.stringify(event);
                dataContainer.appendChild(eventElement);
            });
        })
        .catch(error => console.error("Error fetching events:", error));
}

function fetchUsers() {
    fetch("http://127.0.0.1:8000/api/v1/users/1/")
        .then(response => response.json())
        .then(user => {
            const dataContainer = document.getElementById("user-info-container");
            dataContainer.innerHTML = "";
            const userInfoElement = document.createElement("div");
            userInfoElement.innerHTML = `
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Password:</strong> ${user.password}</p>
            `;
            dataContainer.appendChild(userInfoElement);
        })
        .catch(error => console.error("Error fetching user info:", error));
}

function fetchEventGuests() {
    fetch("http://127.0.0.1:8000/api/v1/event-invites/event/2/")
        .then(response => response.json())
        .then(invites => {
            const guestIds = invites.map(invite => invite.invitee);

            Promise.all(guestIds.map(guestId => fetch(`http://127.0.0.1:8000/api/v1/users/${guestId}/`)))
                .then(responses => Promise.all(responses.map(response => response.json())))
                .then(users => {
                    const usernames = users.map(user => user.username);
                    const dataContainer = document.getElementById("event-guests-container");
                    dataContainer.innerHTML = "";
                    const guestListElement = document.createElement("div");
                    guestListElement.innerHTML = usernames.join("<br>");
                    dataContainer.appendChild(guestListElement);
                })
                .catch(error => console.error("Error fetching event guests:", error));
        })
        .catch(error => console.error("Error fetching event invites:", error));
}

window.onload = fetchEvents;
