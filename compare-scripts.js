document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedEvents = JSON.parse(decodeURIComponent(urlParams.get('events')));

    const eventsData = JSON.parse(localStorage.getItem('events')) || [];
    const comparisonTable = document.getElementById('comparisonTable');

    selectedEvents.forEach(eventName => {
        const event = eventsData.find(e => e.title === eventName);
        if (event) {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'compare-item';
            eventDiv.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>설명:</strong> ${event.content}</p>
                <p><strong>최소 비용:</strong> ${event.price}원</p>
                <h4>서비스 목록:</h4>
                <ul>
                    ${event.services.map(service => `<li>${service}</li>`).join('')}
                </ul>
            `;
            comparisonTable.appendChild(eventDiv);
        }
    });
});
