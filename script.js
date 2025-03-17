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
        img.crossOrigin = "anonymous"; // CORS 허용 설정 추가
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

// 이미지 URL 복사 기능 개선
function copyImageUrl() {
    const canvas = document.getElementById('canvas');
    
    try {
        // 최고 품질로 캔버스를 이미지 URL로 변환 (png 형식)
        const imageUrl = canvas.toDataURL('image/png', 1.0);
        
        // 클립보드에 URL 복사
        navigator.clipboard.writeText(imageUrl)
            .then(() => {
                // 복사 성공 알림 표시
                const notification = document.getElementById('copyNotification');
                notification.textContent = '이미지 URL이 복사되었습니다!';
                notification.style.display = 'block';
                
                // 3초 후 알림 숨기기
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 3000);
                
                console.log('이미지 URL이 클립보드에 복사되었습니다.');
                
                // 이미지 URL을 새 창에서 열기
                const newWindow = window.open();
                if (newWindow) {
                    // HTML 페이지 생성하여 이미지를 최적의 방식으로 표시
                    newWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>편지 이미지</title>
                            <style>
                                body {
                                    margin: 0;
                                    padding: 0;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    min-height: 100vh;
                                    background-color: #f0f0f0;
                                }
                                img {
                                    max-width: 100%;
                                    max-height: 90vh;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                }
                            </style>
                        </head>
                        <body>
                            <img src="${imageUrl}" alt="편지 이미지">
                        </body>
                        </html>
                    `);
                    newWindow.document.close();
                }
            })
            .catch(err => {
                console.error('클립보드 복사 실패:', err);
                
                // 복사 실패 시에도 이미지는 보여주기
                const newWindow = window.open();
                if (newWindow) {
                    newWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>편지 이미지</title>
                            <style>
                                body {
                                    margin: 0;
                                    padding: 0;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    min-height: 100vh;
                                    background-color: #f0f0f0;
                                }
                                img {
                                    max-width: 100%;
                                    max-height: 90vh;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                }
                                .error {
                                    color: red;
                                    margin-bottom: 20px;
                                    text-align: center;
                                }
                            </style>
                        </head>
                        <body>
                            <div>
                                <div class="error">URL 복사에 실패했지만 이미지는 표시됩니다.</div>
                                <img src="${imageUrl}" alt="편지 이미지">
                            </div>
                        </body>
                        </html>
                    `);
                    newWindow.document.close();
                } else {
                    alert('이미지 URL 복사 및 표시에 실패했습니다. 팝업 차단을 확인해주세요.');
                }
            });
    } catch(e) {
        console.error('이미지 URL 생성 실패:', e);
        alert('이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 페이지 로드 시 기본값 설정 (변경 없음)
window.onload = function() {
    // 폰트 크기 설정
    updateFontSize(currentFontSize);
    updateLineHeight(15); // 기본값 1.5
    
    // 기본 배경 이미지로 캔버스 초기화
    drawCanvas();
};
