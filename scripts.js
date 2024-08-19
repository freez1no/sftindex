// 메인 페이지 스크립트
let selectedEvents = [];

document.addEventListener('DOMContentLoaded', function() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const eventList = document.querySelector('.event-list');

    events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';

        eventItem.addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                loadEventDetails(event);
                window.location.href = '#details';
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

    loadComparison(selectedEvents);
    window.location.href = '#compare';
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

// 행사 등록 스크립트
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

    window.location.href = '#';
});

// 행사 상세보기 스크립트
let currentEventName = '';

function loadEventDetails(event) {
    currentEventName = event.title;
    document.getElementById('eventName').textContent = event.title;
    document.getElementById('eventDescription').textContent = event.content;
    document.getElementById('minPrice').textContent = event.price + '원';

    const serviceList = document.getElementById('serviceList');
    serviceList.innerHTML = ''; // 이전 내용 초기화
    event.services.forEach(service => {
        const li = document.createElement('li');
        li.textContent = service;
        serviceList.appendChild(li);
    });
}

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

// 행사 비교 스크립트
function loadComparison(selectedEvents) {
    const eventsData = JSON.parse(localStorage.getItem('events')) || [];
    const comparisonTable = document.getElementById('comparisonTable');
    comparisonTable.innerHTML = ''; // 초기화

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
}
