let currentEventName = '';

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    currentEventName = urlParams.get('name');

    const eventDetails = JSON.parse(localStorage.getItem('events')) || [];

    const event = eventDetails.find(e => e.title === currentEventName);
    if (event) {
        document.getElementById('eventName').textContent = event.title;
        document.getElementById('eventDescription').textContent = event.content;
        document.getElementById('minPrice').textContent = event.price + '원';

        const serviceList = document.getElementById('serviceList');
        event.services.forEach(service => {
            const li = document.createElement('li');
            li.textContent = service;
            serviceList.appendChild(li);
        });
    }
});

function enableEditing() {
    document.getElementById('eventDescription').contentEditable = true;
    document.getElementById('minPrice').contentEditable = true;
    document.getElementById('serviceList').contentEditable = true;
    document.getElementById('editButton').style.display = 'none';
    document.getElementById('saveButton').style.display = 'inline-block';
}

function saveChanges() {
    const updatedDescription = document.getElementById('eventDescription').textContent;
    const updatedPrice = document.getElementById('minPrice').textContent.replace('원', '');
    const updatedServices = Array.from(document.getElementById('serviceList').children).map(li => li.textContent);

    let events = JSON.parse(localStorage.getItem('events')) || [];

    const eventIndex = events.findIndex(e => e.title === currentEventName);
    if (eventIndex > -1) {
        events[eventIndex].content = updatedDescription;
        events[eventIndex].price = updatedPrice;
        events[eventIndex].services = updatedServices;
        localStorage.setItem('events', JSON.stringify(events));

        alert('행사 정보가 수정되었습니다.');

        document.getElementById('eventDescription').contentEditable = false;
        document.getElementById('minPrice').contentEditable = false;
        document.getElementById('serviceList').contentEditable = false;
        document.getElementById('editButton').style.display = 'inline-block';
        document.getElementById('saveButton').style.display = 'none';
    }
}
