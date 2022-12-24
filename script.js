const container = document.getElementById("container");
const canvas = document.getElementById("canvas1");
const file = document.getElementById("file-upload");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const audioContext = new AudioContext();
const ctx = canvas.getContext("2d");

let audioSource;
let analyser;

file.addEventListener("change", function () {
  const files = this.files;
  console.log(files);
  const audio1 = document.getElementById("audio1");
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
  audioSource = audioContext.createMediaElementSource(audio1);
  analyser = audioContext.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 128;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = 5;
  let barHeight;
  let x;

  const animate = () => {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
    requestAnimationFrame(animate);
  };
  animate();
});

const drawVisualizer = (bufferLength, x, barWidth, barHeight, dataArray) => {
  for (let i = 0; i < bufferLength; i++) {
    dataArray[i] > 250
      ? (barHeight = dataArray[i] * 0.8)
      : (barHeight = dataArray[i]);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(((i * (Math.PI * 9)) / bufferLength) * 2.5);

    const hue = i;
    ctx.fillStyle = "hsl(" + hue + ", 100% , 50%)";

    ctx.fillRect(0, 0, barWidth, barHeight);
    x += barWidth;
    ctx.restore();
  }

  for (let i = 0; i < bufferLength; i++) {
    dataArray[bufferLength - i - 1] > 250
      ? (barHeight = dataArray[bufferLength - i - 1] * 0.8)
      : (barHeight = dataArray[bufferLength - i - 1]);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(((i * (Math.PI * 10)) / bufferLength) * 2.5);

    const hue = i;
    ctx.fillStyle = "hsl(" + hue + ", 100% , 50%)";

    ctx.fillRect(0, 0, barWidth, barHeight);
    x += barWidth;
    ctx.restore();
  }
};
// button1.addEventListener("click", function () {
//   audio1.play();
//   // audio1.addEventListener("volumechange", function(){})
// });

// const button2 = document.getElementById("button2");

// const playSound = () => {
//   const oscillator = audioContext.createOscillator();
//   oscillator.connect(audioContext.destination);
//   oscillator.type = "triangle";
//   oscillator.start();
// };
// button2.addEventListener("click", playSound);
