document.getElementById('eventForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const content = document.getElementById('content').value;
    const price = document.getElementById('price').value;
    const contact = document.getElementById('contact').value;

    let events = JSON.parse(localStorage.getItem('events')) || [];

    const newEvent = {
        title,
        subtitle,
        content,
        price,
        contact,
        services: [], 
    };

    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));

    window.location.href = 'main.html';
});
