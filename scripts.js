let currentEventTitle = '';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

document.addEventListener('DOMContentLoaded', function() {
    showSection('eventList');
    loadEventList();
    loadFavorites();

    document.getElementById('registerForm').addEventListener('submit', function (event) {
        event.preventDefault();
        registerEvent();
    });

    // 페이지 로드 시 하단 네비게이션 바 표시
    document.querySelector('.bottom-nav').classList.remove('hidden');
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });

    if (sectionId === 'favorites') {
        loadFavorites();
    }
}

function loadEventList() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const eventList = document.querySelector('#eventList .event-list');
    eventList.innerHTML = '';

    events.forEach((event, index) => {
        const eventItemWrapper = document.createElement('div');
        eventItemWrapper.className = 'event-item-wrapper';
        eventItemWrapper.innerHTML = `
            <label>
                <input type="checkbox" class="event-checkbox" value="${event.title}">
                <a class="event-item" href="#" onclick="showEventDetails('${event.title}')">
                    <img src="${event.photo}" alt="행사 이미지">
                    <div>
                        <h3>${event.title}</h3>
                        <p>${event.subtitle}</p>
                    </div>
                </a>
                <button class="delete-button" onclick="deleteEvent(${index})">삭제</button>
            </label>
        `;

        eventList.appendChild(eventItemWrapper);
    });
}

function registerEvent() {
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const introduction = document.getElementById('introduction').value;
    const services = Array.from(document.getElementsByName('services[]')).map(input => input.value);
    const prices = Array.from(document.getElementsByName('prices[]')).map(input => input.value);
    const contact = document.getElementById('contact').value;
    const photoFiles = document.getElementById('photos').files;

    if (photoFiles.length === 0) {
        alert('최소 한 개의 사진을 업로드해야 합니다.');
        return;
    }

    const photos = [];
    let loadedImages = 0;

    for (let i = 0; i < photoFiles.length; i++) {
        const reader = new FileReader();
        reader.onload = function (event) {
            photos.push(event.target.result);
            loadedImages++;
            if (loadedImages === photoFiles.length) {
                saveEvent(photos);
            }
        };
        reader.readAsDataURL(photoFiles[i]);
    }

    function saveEvent(photos) {
        const newEvent = {
            title,
            subtitle,
            introduction,
            services,
            prices,
            contact,
            photo: photos[0], // 첫 번째 사진을 사용
            reviews: [] // 리뷰 초기화
        };

        const events = JSON.parse(localStorage.getItem('events')) || [];
        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));

        alert('행사가 성공적으로 등록되었습니다.');
        loadEventList();
        showSection('eventList');
    }
}

function addServiceField() {
    const serviceFields = document.getElementById('serviceFields');
    const serviceIndex = serviceFields.children.length + 1;
    const newField = document.createElement('div');
    newField.className = 'form-group';
    newField.innerHTML = `
        <label for="service${serviceIndex}">서비스 ${serviceIndex}</label>
        <input type="text" id="service${serviceIndex}" name="services[]" required>
        <label for="price${serviceIndex}">가격 ${serviceIndex}</label>
        <input type="number" id="price${serviceIndex}" name="prices[]" required>
    `;
    serviceFields.appendChild(newField);
}

function showEventDetails(eventTitle) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const event = events.find(e => e.title === eventTitle);

    if (event) {
        currentEventTitle = event.title;
        document.getElementById('eventPhoto').src = event.photo;
        document.getElementById('eventTitle').textContent = event.title;
        document.getElementById('eventSubtitle').textContent = event.subtitle;
        document.getElementById('eventIntroduction').textContent = event.introduction;
        
        const eventServices = document.getElementById('eventServices');
        eventServices.innerHTML = '<h3>서비스 목록:</h3>';
        event.services.forEach((service, index) => {
            const serviceItem = document.createElement('p');
            serviceItem.textContent = `${service}: ${event.prices[index]}원`;
            eventServices.appendChild(serviceItem);
        });

        document.getElementById('eventContact').textContent = event.contact;

        loadReviews(event.reviews);

        showSection('eventDetails');
    }
}

function loadReviews(reviews) {
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = '';

    if (reviews && reviews.length > 0) {
        reviews.forEach(review => {
            const reviewItem = document.createElement('li');
            reviewItem.innerHTML = `<strong>별점: ${'★'.repeat(review.rating)}</strong> - ${review.text}`;
            reviewList.appendChild(reviewItem);
        });
    } else {
        reviewList.innerHTML = '<li>아직 리뷰가 없습니다.</li>';
    }
}

function toggleFavorite() {
    const index = favorites.indexOf(currentEventTitle);
    if (index === -1) {
        favorites.push(currentEventTitle);
        alert('즐겨찾기에 추가되었습니다.');
    } else {
        favorites.splice(index, 1);
        alert('즐겨찾기에서 제거되었습니다.');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadFavorites() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const favoriteEvents = events.filter(event => favorites.includes(event.title));
    const favoriteList = document.querySelector('#favorites .event-list');
    favoriteList.innerHTML = '';

    favoriteEvents.forEach(event => {
        const eventItemWrapper = document.createElement('div');
        eventItemWrapper.className = 'event-item-wrapper';
        eventItemWrapper.innerHTML = `
            <a class="event-item" href="#" onclick="showEventDetails('${event.title}')">
                <img src="${event.photo}" alt="행사 이미지">
                <div>
                    <h3>${event.title}</h3>
                    <p>${event.subtitle}</p>
                </div>
            </a>
        `;
        favoriteList.appendChild(eventItemWrapper);
    });
}

function deleteEvent(index) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    if (index > -1) {
        events.splice(index, 1);
        localStorage.setItem('events', JSON.stringify(events));
        loadEventList();
        loadFavorites();
    }
}

function compareSelected() {
    const selectedTitles = Array.from(document.querySelectorAll('.event-checkbox:checked')).map(input => input.value);
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const compareGrid = document.getElementById('compareGrid');
    compareGrid.innerHTML = '';

    if (selectedTitles.length < 2 || selectedTitles.length > 4) {
        alert('비교를 위해 최소 2개, 최대 4개의 행사를 선택하세요.');
        return;
    }

    selectedTitles.forEach(title => {
        const event = events.find(e => e.title === title);
        if (event) {
            const averageRating = calculateAverageRating(event.reviews);
            const compareItem = document.createElement('div');
            compareItem.className = 'compare-item';
            compareItem.innerHTML = `
                <img src="${event.photo}" alt="${event.title}">
                <h3>${event.title}</h3>
                <p>평균 평점: ${averageRating ? averageRating.toFixed(1) : 'N/A'}</p>
                ${event.services.map((service, index) => `<p>${service}: ${event.prices[index]}원</p>`).join('')}
            `;
            compareGrid.appendChild(compareItem);
        }
    });

    showSection('compareEvents');
}

function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return null;
    const total = reviews.reduce((sum, review) => sum + parseInt(review.rating), 0);
    return total / reviews.length;
}

function submitReview() {
    const reviewText = document.getElementById('reviewText').value.trim();
    const rating = document.querySelector('input[name="rating"]:checked') ? document.querySelector('input[name="rating"]:checked').value : null;
    
    if (!reviewText || !rating) {
        alert('리뷰와 별점을 모두 입력해주세요.');
        return;
    }

    const events = JSON.parse(localStorage.getItem('events')) || [];
    const event = events.find(e => e.title === currentEventTitle);
    if (event) {
        event.reviews.push({ text: reviewText, rating: parseInt(rating) });
        localStorage.setItem('events', JSON.stringify(events));
        alert('리뷰가 성공적으로 등록되었습니다.');
        document.getElementById('reviewText').value = '';
        document.querySelectorAll('input[name="rating"]').forEach(input => input.checked = false);
        showEventDetails(currentEventTitle);
    }
}
