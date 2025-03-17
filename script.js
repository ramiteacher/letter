const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let image = new Image();
image.src = 'd.jpg'; // 기본 이미지 파일 경로

image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

let currentFontSize = 30;
let currentBackground = 'd.jpg'; // 기본 배경 설정
let currentLineHeight = 1.5;
let currentFont = 's';

// 텍스트 영역 자동 크기 조정
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// 글자 크기 업데이트
function updateFontSize(value) {
    currentFontSize = parseInt(value);
    document.getElementById('fontSizeValue').textContent = value + 'px';
    // 텍스트 입력창에는 영향을 주지 않음
    if (currentBackground) {
        drawCanvas(); // 배경이 있으면 캔버스 업데이트
    }
}

// 줄간격 업데이트
function updateLineHeight(value) {
    currentLineHeight = value / 10;
    document.getElementById('lineHeightValue').textContent = currentLineHeight.toFixed(1);
    // 텍스트 입력창에는 영향을 주지 않음
    if (currentBackground) {
        drawCanvas(); // 배경이 있으면 캔버스 업데이트
    }
}

// 폰트 업데이트
function updateFont(value) {
    currentFont = value;
    // 텍스트 입력창에는 영향을 주지 않음
    if (currentBackground) {
        drawCanvas(); // 배경이 있으면 캔버스 업데이트
    }
}

// 배경 선택
function selectBackground(imgSrc) {
    currentBackground = imgSrc;
    console.log('배경 선택됨: ' + imgSrc);
    drawCanvas(); // 배경 선택 시 즉시 캔버스 업데이트
}

// 캔버스 그리기 (배경과 텍스트 포함)
function drawCanvas() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // 캔버스를 완전히 지우기 (중요!)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경 이미지 그리기
    if (currentBackground) {
        const img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            drawText(); // 배경이 로드된 후 텍스트 그리기
        };
        img.src = currentBackground;
    } else {
        // 배경 없이 흰색 배경으로 초기화
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawText(); // 배경 초기화 후 텍스트 그리기
    }
}

// 텍스트만 그리기 (배경 위에)
function drawText() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const text = document.getElementById('textInput').value;
    
    ctx.font = `${currentFontSize}px ${currentFont}, Arial, sans-serif`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center'; // 텍스트 중앙 정렬
    
    const lines = text.split('\n');
    const lineHeight = currentFontSize * currentLineHeight;
    let y = 110; // 상단에서 약 110px 떨어진 위치에서 시작
    const x = canvas.width / 2; // 캔버스의 중앙 x 좌표
    
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y);
        y += lineHeight;
    }
}

// 이미지 URL 복사 기능 수정
function copyImageUrl() {
    const canvas = document.getElementById('canvas');
    
    // 더 작은 크기의 캔버스 생성
    const scaleFactor = 0.5; // 크기를 50%로 줄임
    const smallerCanvas = document.createElement('canvas');
    const smallerCtx = smallerCanvas.getContext('2d');
    
    // 축소된 크기 설정
    smallerCanvas.width = canvas.width * scaleFactor;
    smallerCanvas.height = canvas.height * scaleFactor;
    
    // 원본 캔버스 내용을 축소하여 그리기
    smallerCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
    
    // 캔버스를 이미지 URL로 변환 (jpeg 형식 및 낮은 품질)
    const imageUrl = smallerCanvas.toDataURL('image/jpeg', 0.5); // 품질 50%로 설정
    
    // 클립보드에 URL 복사
    navigator.clipboard.writeText(imageUrl)
        .then(() => {
            // 복사 성공 알림 표시
            const notification = document.getElementById('copyNotification');
            notification.textContent = '축소된 이미지 URL이 복사되었습니다!';
            notification.style.display = 'block';
            
            // 3초 후 알림 숨기기
            setTimeout(() => {
                notification.style.display = 'none';
                notification.textContent = '이미지 URL이 클립보드에 복사되었습니다!';
            }, 3000);
            
            console.log('이미지 URL이 클립보드에 복사되었습니다.');
        })
        .catch(err => {
            console.error('클립보드 복사 실패:', err);
            alert('이미지 URL 복사에 실패했습니다.');
        });
}

// NFC용 작은 URL 생성
function copySmallImageUrl() {
    const canvas = document.getElementById('canvas');
    
    // 더 작은 크기의 캔버스 생성
    const smallerCanvas = document.createElement('canvas');
    const smallerCtx = smallerCanvas.getContext('2d');
    
    // 크기를 대폭 축소 (NFC에 맞게)
    smallerCanvas.width = 300; // 300px 너비
    smallerCanvas.height = 400; // 400px 높이
    
    // 원본 캔버스 내용을 축소하여 그리기
    smallerCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
    
    // 낮은 품질의 JPEG로 변환
    const imageUrl = smallerCanvas.toDataURL('image/jpeg', 0.3); // 품질 30%로 설정
    
    // 클립보드에 URL 복사
    navigator.clipboard.writeText(imageUrl)
        .then(() => {
            const notification = document.getElementById('copyNotification');
            notification.textContent = 'NFC용 작은 URL이 복사되었습니다!';
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        })
        .catch(err => {
            console.error('URL 복사 실패:', err);
            alert('URL 복사에 실패했습니다.');
        });
}

// 페이지 로드 시 기본값 설정
window.onload = function() {
    // 폰트 크기 설정
    updateFontSize(currentFontSize);
    updateLineHeight(15); // 기본값 1.5
    
    // 기본 배경 이미지로 캔버스 초기화
    drawCanvas();
};
