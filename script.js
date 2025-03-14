const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const image = new Image();
image.src = 'd.jpg'; // 이미지 파일 경로

image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

function drawText() {
    const text = document.getElementById('textInput').value;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스를 지움
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // 이미지를 다시 그림

    ctx.font = '30px s'; // s.ttf 폰트를 사용
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