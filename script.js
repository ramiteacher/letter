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

// 이미지 업로드 및 URL 생성 함수
function uploadToImgBB() {
  // 먼저 캔버스에 텍스트를 그립니다 (기존 drawCanvas 함수 기능 포함)
  drawCanvas();
  
  // 캔버스 요소 가져오기
  const canvas = document.getElementById('canvas');
  
  // 사용자에게 업로드 중임을 알립니다
  document.getElementById('copyNotification').style.display = 'block';
  document.getElementById('copyNotification').textContent = '이미지 업로드 중...';
  
  // 캔버스를 PNG 형식의 Blob 객체로 변환
  canvas.toBlob(function(blob) {
    // FormData 객체 생성 (파일 업로드용)
    const formData = new FormData();
    formData.append('image', blob);
    
    // ImgBB API로 이미지 업로드 요청
    fetch('https://api.imgbb.com/1/upload?key=29307367a8c33b0ed8a20848032f3982', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('서버 응답이 올바르지 않습니다.');
      }
      return response.json();
    })
    .then(data => {
      // 업로드 성공 시 이미지 URL 받기
      const imageUrl = data.data.url;
      
      // URL을 클립보드에 복사
      navigator.clipboard.writeText(imageUrl)
        .then(() => {
          // 성공 메시지 표시
          document.getElementById('copyNotification').textContent = '이미지 URL이 클립보드에 복사되었습니다!';
          setTimeout(() => {
            document.getElementById('copyNotification').style.display = 'none';
          }, 3000);
        })
        .catch(err => {
          console.error('클립보드 복사 실패:', err);
          document.getElementById('copyNotification').textContent = '클립보드 복사 실패, URL: ' + imageUrl;
        });
    })
    .catch(error => {
      // 에러 처리
      console.error('오류:', error);
      document.getElementById('copyNotification').textContent = '이미지 업로드 실패: ' + error.message;
      setTimeout(() => {
        document.getElementById('copyNotification').style.display = 'none';
      }, 3000);
    });
  }, 'image/png', 0.9); // 이미지 품질 0.9로 설정
}

// 페이지 로드 시 기본값 설정
window.onload = function() {
    // 폰트 크기 설정
    updateFontSize(currentFontSize);
    updateLineHeight(15); // 기본값 1.5
    
    // 기본 배경 이미지로 캔버스 초기화
    drawCanvas();
};
