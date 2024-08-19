document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // 3초에 걸쳐 서서히 사라지게 함
        document.getElementById('loading-screen').style.opacity = '0';
        
        // 애니메이션이 끝난 후 (3초 후) 요소를 완전히 제거
        setTimeout(function() {
            document.getElementById('loading-screen').style.display = 'none';
        }, 1000);
    }, 1000); // 페이지 로드 후 3초 동안 로딩 화면을 유지
});

document.addEventListener('DOMContentLoaded', function() {
    const page = window.location.hash.substr(1) || 'main';
    loadPage(page);
    window.addEventListener('hashchange', function() {
        const newPage = window.location.hash.substr(1);
        loadPage(newPage);
    });
});

function loadPage(page) {
    const content = document.getElementById('content');

    switch (page.split('?')[0]) { // hash에서 페이지 부분만 분리
        case 'main':
            loadMainPage(content);
            break;
        case 'register':
            loadRegisterPage(content);
            break;
        case 'event-details':
            loadEventDetailsPage(content, page);
            break;
        case 'compare':
            loadComparePage(content);
            break;
        default:
            loadMainPage(content);
            break;
    }
}

function loadMainPage(content) {
    content.innerHTML = `
        <div class="button-container">
            <a href="#register">행사 등록</a>
        </div>
        <section class="event-list">
            <h2>홍보하는 행사 목록</h2>
            <!-- 행사 목록이 로드됩니다 -->
        </section>
        <div class="compare-container">
            <button id="compareButton" onclick="compareSelected()">비교하기</button>
        </div>
    `;

    const events = JSON.parse(localStorage.getItem('events')) || [];
    const eventList = content.querySelector('.event-list');

    events.forEach((event, index) => {
        const eventItemWrapper = document.createElement('div');
        eventItemWrapper.className = 'event-item-wrapper';
        eventItemWrapper.innerHTML = `
            <div class="event-item">
                <input type="checkbox" class="event-checkbox" data-index="${index}">
                <div class="event-content">
                    <img src="${event.photos[0]}" alt="행사 이미지">
                    <div>
                        <h3>${event.title}</h3>
                        <p>${event.subtitle}</p>
                        <p>최소 금액: ${event.minPrice}원</p>
                    </div>
                </div>
                <button class="delete-button" onclick="deleteEvent(${index})">삭제</button>
            </div>
        `;

        // 삭제 버튼 클릭 시 이벤트 전파를 중지
        eventItemWrapper.querySelector('.delete-button').addEventListener('click', function(event) {
            event.stopPropagation();
            deleteEvent(index);
        });

        // 체크박스 클릭 시 이벤트 전파를 중지
        eventItemWrapper.querySelector('.event-checkbox').addEventListener('click', function(event) {
            event.stopPropagation();
        });

        // 박스 클릭 시 상세 보기로 이동
        eventItemWrapper.addEventListener('click', function() {
            window.location.href = `#event-details?name=${encodeURIComponent(event.title)}`;
        });

        eventList.appendChild(eventItemWrapper);
    });
}

function deleteEvent(index) {
    if (confirm('정말 이 행사를 삭제하시겠습니까?')) {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        events.splice(index, 1);
        localStorage.setItem('events', JSON.stringify(events));
        loadPage('main');
    }
}

function compareSelected() {
    const checkboxes = document.querySelectorAll('.event-checkbox:checked');
    const selectedEvents = Array.from(checkboxes).map(checkbox => {
        return JSON.parse(localStorage.getItem('events'))[checkbox.dataset.index];
    });

    if (selectedEvents.length < 2 || selectedEvents.length > 4) {
        alert('비교를 위해 최소 2개, 최대 4개의 행사를 선택하세요.');
        return;
    }

    localStorage.setItem('selectedEvents', JSON.stringify(selectedEvents));
    window.location.href = '#compare';
}

function loadRegisterPage(content) {
    content.innerHTML = `
        <form id="registerForm">
            <div class="form-group">
                <label for="title">업체 이름</label>
                <input type="text" id="title" name="title" required>
            </div>
            <div class="form-group">
                <label for="subtitle">부제목</label>
                <input type="text" id="subtitle" name="subtitle" required>
            </div>
            <div class="form-group">
                <label for="introduction">업체 소개</label>
                <textarea id="introduction" name="introduction" required></textarea>
            </div>
            <div class="form-group">
                <label for="content">행사 내용</label>
                <textarea id="content" name="content" required></textarea>
            </div>
            <div class="form-group">
                <label for="minPrice">최소 금액</label>
                <input type="number" id="minPrice" name="minPrice" required>
            </div>
            <div class="form-group">
                <label for="maxPrice">최대 금액</label>
                <input type="number" id="maxPrice" name="maxPrice" required>
            </div>
            <div class="form-group">
                <label for="contact">연락처</label>
                <input type="text" id="contact" name="contact" required>
            </div>
            <div class="form-group">
                <label for="photos">업체 사진</label>
                <input type="file" id="photos" name="photos" multiple accept="image/*" required>
            </div>
            <div class="form-group">
                <button type="submit">등록</button>
            </div>
        </form>
    `;

    document.getElementById('registerForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const subtitle = document.getElementById('subtitle').value;
        const introduction = document.getElementById('introduction').value;
        const content = document.getElementById('content').value;
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const contact = document.getElementById('contact').value;
        const photoFiles = document.getElementById('photos').files;

        const photos = [];
        for (let i = 0; i < photoFiles.length; i++) {
            const reader = new FileReader();
            reader.onload = function (event) {
                photos.push(event.target.result);
                if (photos.length === photoFiles.length) {
                    saveEvent();
                }
            };
            reader.readAsDataURL(photoFiles[i]);
        }

        function saveEvent() {
            const newEvent = {
                title,
                subtitle,
                introduction,
                content,
                minPrice,
                maxPrice,
                contact,
                photos
            };

            const events = JSON.parse(localStorage.getItem('events')) || [];
            events.push(newEvent);
            localStorage.setItem('events', JSON.stringify(events));

            alert('행사가 성공적으로 등록되었습니다.');
            loadPage('main');
        }
    });
}

function loadEventDetailsPage(content, page) {
    const urlParams = new URLSearchParams(page.split('?')[1]);
    const currentEventName = urlParams.get('name');

    const eventDetails = JSON.parse(localStorage.getItem('events')) || [];

    const event = eventDetails.find(e => e.title.trim() === decodeURIComponent(currentEventName).trim()); // 정확한 이름 비교를 위해 decodeURIComponent 사용


    if (event) {
        content.innerHTML = `
            <div class="button-container">
                <button onclick="loadPage('main')">뒤로 가기</button>
                <button onclick="applyForEvent()">신청하기</button>
                <button onclick="editEvent()">수정하기</button>
            </div>

            <section class="event-detail">
                <div>
                    <h2 id="eventTitle">${event.title}</h2>
                    <p id="eventSubtitle">${event.subtitle}</p>
                </div>
                <div class="event-image">
                    <img id="eventPhoto" src="${event.photos[0]}" alt="업체 사진">
                </div>
                <div>
                    <h3>업체 소개:</h3>
                    <p id="eventIntroduction">${event.introduction}</p>
                </div>
                <div>
                    <h3>내용:</h3>
                    <p id="eventContent">${event.content}</p>
                </div>
                <div>
                    <h3>금액:</h3>
                    <p id="eventPrice">${event.minPrice}원 - ${event.maxPrice}원</p>
                </div>
                <div>
                    <h3>연락처:</h3>
                    <p id="eventContact">${event.contact}</p>
                </div>
            </section>
        `;
    } else {
        content.innerHTML = '<p>행사를 찾을 수 없습니다.</p>';
    }
}

function applyForEvent() {
    alert("신청이 완료되었습니다!");
}

function editEvent() {
    const currentEventName = new URLSearchParams(window.location.hash.split('?')[1]).get('name');
    const eventDetails = JSON.parse(localStorage.getItem('events')) || [];
    const eventIndex = eventDetails.findIndex(e => e.title === currentEventName);

    if (eventIndex !== -1) {
        const event = eventDetails[eventIndex];

        const newTitle = prompt("업체 이름을 입력하세요:", event.title);
        const newSubtitle = prompt("부제목을 입력하세요:", event.subtitle);
        const newIntroduction = prompt("업체 소개를 입력하세요:", event.introduction);
        const newContent = prompt("행사 내용을 입력하세요:", event.content);
        const newMinPrice = prompt("최소 금액을 입력하세요:", event.minPrice);
        const newMaxPrice = prompt("최대 금액을 입력하세요:", event.maxPrice);
        const newContact = prompt("연락처를 입력하세요:", event.contact);

        event.title = newTitle || event.title;
        event.subtitle = newSubtitle || event.subtitle;
        event.introduction = newIntroduction || event.introduction;
        event.content = newContent || event.content;
        event.minPrice = newMinPrice || event.minPrice;
        event.maxPrice = newMaxPrice || event.maxPrice;
        event.contact = newContact || event.contact;

        eventDetails[eventIndex] = event;
        localStorage.setItem('events', JSON.stringify(eventDetails));

        alert("수정이 완료되었습니다.");
        loadEventDetailsPage(document.getElementById('content'), window.location.hash);
    } else {
        alert("수정할 행사를 찾을 수 없습니다.");
    }
}

function loadComparePage(content) {
    content.innerHTML = `
        <div class="compare-grid" id="compareGrid">
            <!-- 선택된 행사 목록이 로드됩니다 -->
        </div>
    `;

    const selectedEvents = JSON.parse(localStorage.getItem('selectedEvents')) || [];
    const compareGrid = document.getElementById('compareGrid');

    if (selectedEvents.length < 2 || selectedEvents.length > 4) {
        alert('비교를 위해 최소 2개, 최대 4개의 행사를 선택하세요.');
        loadPage('main');
        return;
    }

    selectedEvents.forEach(event => {
        const compareItem = document.createElement('div');
        compareItem.className = 'compare-item';
        compareItem.innerHTML = `
            <img src="${event.photos[0]}" alt="${event.title}">
            <h3>${event.title}</h3>
            <p>최소 금액: ${event.minPrice}원</p>
        `;
        compareGrid.appendChild(compareItem);
    });
}
