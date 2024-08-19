document.getElementById('event-list-btn').addEventListener('click', function() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="company-box">
            <img src="company1-logo.png" alt="업체 1 로고" class="company-logo">
            <div>
                <h2>업체 1</h2>
                <p>서비스 가능 목록: 웨딩, 파티</p>
                <p>업체 한줄 소개: 최고의 웨딩 플래너</p>
                <button onclick="showDetails(1)">자세히 보기</button>
                <button onclick="toggleCompare(1)">비교</button>
            </div>
        </div>
        <div class="company-box">
            <img src="company2-logo.png" alt="업체 2 로고" class="company-logo">
            <div>
                <h2>업체 2</h2>
                <p>서비스 가능 목록: 컨퍼런스, 전시회</p>
                <p>업체 한줄 소개: 성공적인 이벤트를 위한 최선의 선택</p>
                <button onclick="showDetails(2)">자세히 보기</button>
                <button onclick="toggleCompare(2)">비교</button>
            </div>
        </div>
        <div id="compare-section" class="compare-section"></div>
    `;
});

let compareList = [];

function toggleCompare(companyId) {
    if (compareList.includes(companyId)) {
        compareList = compareList.filter(id => id !== companyId);
    } else {
        compareList.push(companyId);
    }
    updateCompareSection();
}

function updateCompareSection() {
    const compareSection = document.getElementById('compare-section');
    if (compareList.length > 0) {
        compareSection.innerHTML = `
            <p>비교할 업체: ${compareList.join(', ')}</p>
            <button onclick="compareCompanies()">업체 비교하기</button>
        `;
    } else {
        compareSection.innerHTML = '';
    }
}

function compareCompanies() {
    alert(`업체 ${compareList.join(', ')}를 비교합니다.`);
    // 실제 비교 로직 구현 필요
}

function showDetails(companyId) {
    alert(`업체 ${companyId}의 자세한 정보를 표시합니다.`);
    // 실제 상세보기 로직 구현 필요
}
