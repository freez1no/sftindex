let selectedEvents = [];

document.addEventListener('DOMContentLoaded', function() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const eventList = document.querySelector('.event-list');

    events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';

        eventItem.addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                window.location.href = `event-details.html?name=${event.title}`;
            }
        });

        eventItem.innerHTML = `
            <input type="checkbox" onchange="toggleCompare('${event.title}')">
            <img src="image-placeholder.jpg" alt="행사 이미지">
            <div>
                <h3>${event.title}</h3>
                <p>${event.subtitle}</p>
                <p>${event.content}</p>
                <p>${event.price}원</p>
                <p>연락처: ${event.contact}</p>
            </div>
            <button class="delete-button" onclick="deleteEvent('${event.title}', event)">삭제</button>
        `;
        eventList.appendChild(eventItem);
    });
});

function toggleCompare(eventName) {
    const index = selectedEvents.indexOf(eventName);

    if (index > -1) {
        selectedEvents.splice(index, 1);
    } else {
        if (selectedEvents.length < 4) {
            selectedEvents.push(eventName);
        } else {
            alert('최대 4개의 행사만 비교할 수 있습니다.');
            return;
        }
    }

    console.log(selectedEvents);
}

function compareSelected() {
    if (selectedEvents.length < 2) {
        alert('최소 2개의 행사 이상을 선택해야 비교할 수 있습니다.');
        return;
    }

    const url = 'compare.html?events=' + encodeURIComponent(JSON.stringify(selectedEvents));
    window.location.href = url;

    const checkboxes = document.querySelectorAll('.event-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);

    selectedEvents = [];
}

function deleteEvent(eventName, event) {
    event.stopPropagation(); // 상세보기로 넘어가지 않도록 클릭 이벤트 중지
    const confirmed = confirm(`정말로 ${eventName}을(를) 삭제하시겠습니까?`);
    if (confirmed) {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        events = events.filter(e => e.title !== eventName);
        localStorage.setItem('events', JSON.stringify(events));
        event.target.closest('.event-item').remove();
    }
}
