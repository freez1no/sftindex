
// 임시 데이터
const events = [
    { id: 1, category: '교외', title: '행사 1', subtitle: '부제목 1', content: '행사 내용 1', imageUrl: 'image1.jpg', isFavorite: false },
    { id: 2, category: '교외', title: '행사 2', subtitle: '부제목 2', content: '행사 내용 2', imageUrl: 'image2.jpg', isFavorite: true },
    { id: 3, category: '교내', title: '행사 3', subtitle: '부제목 3', content: '행사 내용 3', imageUrl: 'image3.jpg', isFavorite: false },
    { id: 4, category: '교내', title: '행사 4', subtitle: '부제목 4', content: '행사 내용 4', imageUrl: 'image4.jpg', isFavorite: true },
    { id: 5, category: '교외', title: '행사 5', subtitle: '부제목 5', content: '행사 내용 5', imageUrl: 'image5.jpg', isFavorite: false }
];

const favorites = events.filter(event => event.isFavorite);

// 페이지 전환 기능
function navigateTo(sectionId) {
    // 모든 섹션 숨기기
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => section.style.display = 'none');

    // 선택한 섹션만 보이도록 설정
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        if (sectionId === 'eventSection') {
            filterEvents('교외');  // 기본으로 교외 카테고리 필터링
        } else if (sectionId === 'favoritesSection') {
            displayFavorites();
        }
    }
}

// 슬라이드쇼 구현
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

setInterval(nextSlide, 3000);

// 초기 슬라이드 설정
showSlide(currentSlide);

// 행사 목록 필터링
function filterEvents(category) {
    const eventList = document.querySelector('.event-list');
    eventList.innerHTML = '';  // 기존 목록 비우기

    const filteredEvents = events.filter(event => event.category === category);

    filteredEvents.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.classList.add('event-item');
        eventItem.innerHTML = `
            <img src="${event.imageUrl}" alt="${event.title}">
            <h3>${event.title}</h3>
            <p>${event.subtitle}</p>
            <p>${event.content}</p>
            <button onclick="toggleFavorite(${event.id})">${event.isFavorite ? '즐겨찾기 취소' : '즐겨찾기 추가'}</button>
            <button onclick="viewEvent(${event.id})">자세히 보기</button>
        `;
        eventList.appendChild(eventItem);
    });
}

// 즐겨찾기 목록 표시
function displayFavorites() {
    const favoritesList = document.querySelector('.favorites-list');
    favoritesList.innerHTML = '';  // 기존 목록 비우기

    favorites.forEach(favorite => {
        const favoriteItem = document.createElement('div');
        favoriteItem.classList.add('favorite-item');
        favoriteItem.innerHTML = `
            <img src="${favorite.imageUrl}" alt="${favorite.title}">
            <h3>${favorite.title}</h3>
            <p>${favorite.subtitle}</p>
            <p>${favorite.content}</p>
            <button onclick="toggleFavorite(${favorite.id})">${favorite.isFavorite ? '즐겨찾기 취소' : '즐겨찾기 추가'}</button>
            <button onclick="viewEvent(${favorite.id})">자세히 보기</button>
        `;
        favoritesList.appendChild(favoriteItem);
    });
}

// 즐겨찾기 추가/취소 기능
function toggleFavorite(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        event.isFavorite = !event.isFavorite;
    }
    // 즐겨찾기 목록 갱신
    displayFavorites();
    filterEvents(event.category);
}

// 행사 세부 정보 보기 (임시 구현)
function viewEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        alert(`행사 세부정보: \n제목: ${event.title}\n부제목: ${event.subtitle}\n내용: ${event.content}`);
    }
}

// 행사 등록 기능 (임시 구현)
function registerEvent() {
    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const content = document.getElementById('content').value;
    const price = document.getElementById('price').value;
    const contact = document.getElementById('contact').value;

    const newEvent = {
        id: events.length + 1,
        category,
        title,
        subtitle,
        content,
        imageUrl: 'image1.jpg', // 기본 이미지 사용
        isFavorite: false
    };

    events.push(newEvent);
    alert('행사가 등록되었습니다!');
    navigateTo('eventSection');
}
