const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let image = new Image();
image.src = 'd.jpg'; // 기본 이미지 파일 경로

image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

function drawText() {
    const text = document.getElementById('textInput').value;
    const fontSize = document.getElementById('fontSize').value + 'px';

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스를 지움
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // 이미지를 다시 그림

    ctx.font = `${fontSize} s`; // 선택한 글자 크기와 폰트를 사용
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center'; // 텍스트 중앙 정렬
    ctx.textBaseline = 'middle'; // 텍스트 중앙 정렬

    const maxWidth = canvas.width - 100; // 텍스트의 최대 너비
    const lineHeight = 40; // 줄 간격
    const x = canvas.width / 2; // 텍스트 시작 위치 (x 좌표)
    const y = 100; // 텍스트 시작 위치 (y 좌표)

    wrapText(ctx, text, x, y, maxWidth, lineHeight);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const lines = text.split('\n'); // 줄 단위로 분리
    lines.forEach((line, index) => {
        context.fillText(line, x, y + (index * lineHeight));
    });
}

function updateFontSize(value) {
    document.getElementById('fontSizeValue').innerText = value + 'px';
    drawText();
}

function selectBackground(imageSrc) {
    image.src = imageSrc;
    image.onload = () => {
        drawText();
    };
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}
