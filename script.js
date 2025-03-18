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

// 이미지 URL 복사 기능
function copyImageUrl() {
    const canvas = document.getElementById('canvas');
    
    // 캔버스를 이미지 URL로 변환 (png 형식)
    const imageUrl = canvas.toDataURL('image/png');
    
    // 클립보드에 URL 복사
    navigator.clipboard.writeText(imageUrl)
        .then(() => {
            // 복사 성공 알림 표시
            const notification = document.getElementById('copyNotification');
            notification.style.display = 'block';
            
            // 3초 후 알림 숨기기
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
            
            console.log('이미지 URL이 클립보드에 복사되었습니다.');
            window.open(imageUrl, '_blank');
        })
        .catch(err => {
            console.error('클립보드 복사 실패:', err);
            alert('이미지 URL 복사에 실패했습니다.');
        });
}

// ImgBB로 이미지 업로드하고 URL 복사 및 이동하는 함수
function uploadToImgBB() {
    // 캔버스에 텍스트 업데이트
    drawCanvas();
    
    // 사용자에게 알림
    const notification = document.getElementById('copyNotification');
    notification.textContent = '이미지 업로드 중...';
    notification.style.display = 'block';
    
    // 백그라운드가 로딩될 시간을 주기 위해 약간 대기
    setTimeout(() => {
        // 캔버스 데이터를 base64로 변환
        const dataUrl = canvas.toDataURL('image/png');
        
        // ImgBB API 요청용 폼데이터 준비
        const formData = new FormData();
        formData.append('image', dataUrl.split(',')[1]); // Base64 데이터만 추출
        
        // ImgBB API 키 - 여기에 본인의 API 키를 입력하세요
        const apiKey = '29307367a8c33b0ed8a20848032f3982'; 
        
        // ImgBB API에 업로드 요청
        fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('업로드 실패: 서버 응답 오류');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // 성공 시 이미지 URL 가져오기
                const imageUrl = data.data.url;
                
                // 클립보드에 URL 복사
                navigator.clipboard.writeText(imageUrl)
                    .then(() => {
                        // 알림 메시지 업데이트
                        notification.innerHTML = `
                            이미지 URL이 클립보드에 복사되었습니다!<br>
                            <a href="${imageUrl}" target="_blank" 
                               style="color: white; text-decoration: underline; margin-top: 5px; display: inline-block;">
                               이미지로 바로 이동하기
                            </a>
                        `;
                        
                        // 5초 후 알림 숨기기
                        setTimeout(() => {
                            notification.style.display = 'none';
                        }, 5000);
                    })
                    .catch(err => {
                        console.error('클립보드 복사 실패:', err);
                        notification.innerHTML = `
                            클립보드 복사 실패.<br>
                            <a href="${imageUrl}" target="_blank" 
                               style="color: white; text-decoration: underline;">
                               여기를 클릭하여 이미지로 이동
                            </a>
                        `;
                    });
            } else {
                throw new Error('업로드 실패: ' + (data.error?.message || '알 수 없는 오류'));
            }
        })
        .catch(error => {
            console.error('오류:', error);
            notification.textContent = '이미지 업로드 실패: ' + error.message;
            
            // 3초 후 알림 숨기기
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        });
    }, 300); // 300ms 딜레이로 캔버스가 완전히 그려진 후 실행
}

// 페이지 로드 시 기본값 설정
window.onload = function() {
    // 폰트 크기 설정
    updateFontSize(currentFontSize);
    updateLineHeight(15); // 기본값 1.5
    
    // 기본 배경 이미지로 캔버스 초기화
    drawCanvas();
};
