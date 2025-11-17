let slides = [];
let currentSlide = 0;
let projectionWindow = null;

function startPresentation() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const text = reader.result;
    slides = splitTextIntoSlides(text);
    currentSlide = 0;
    showPreview();
    openProjectionWindow();
    startVoiceRecognition();
  };
  reader.readAsText(file);
}

function splitTextIntoSlides(text) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.visibility = 'hidden';
  container.style.fontSize = '60px';
  container.style.width = '800px';
  container.style.lineHeight = '1.2';
  container.style.fontFamily = 'Segoe UI, sans-serif';
  document.body.appendChild(container);

  const words = text.split(/\s+/);
  const slides = [];
  let current = [];

  for (let i = 0; i < words.length; i++) {
    current.push(words[i]);
    container.innerText = current.join(' ');
    if (container.scrollHeight > 600) {
      current.pop(); // remove last word that overflowed
      slides.push(current.join(' '));
      current = [words[i]]; // start new slide with overflow word
    }
  }

  if (current.length) {
    container.innerText = current.join(' ');
    if (container.scrollHeight <= 600) {
      slides.push(current.join(' '));
    }
  }

  document.body.removeChild(container);
  return slides;
}


function showPreview() {
  document.getElementById('slidePreview').innerText = slides.map((s, i) => `Slide ${i + 1}:\n${s}\n`).join('\n');
}

function openProjectionWindow() {
  if (!projectionWindow || projectionWindow.closed) {
    projectionWindow = window.open('', 'Projecao', 'width=800,height=600');
  }
  projectionWindow.document.body.innerHTML = '';
  projectionWindow.document.body.style.fontSize = '60px';
  projectionWindow.document.body.style.textAlign = 'center';
  projectionWindow.document.body.style.background = '#000';
  projectionWindow.document.body.style.color = '#fff';
  projectionWindow.document.body.style.margin = '0';
  projectionWindow.document.body.style.display = 'flex';
  projectionWindow.document.body.style.justifyContent = 'center';
  projectionWindow.document.body.style.alignItems = 'center';
  projectionWindow.document.body.style.height = '100vh';
  projectionWindow.document.body.innerText = slides[currentSlide];
}

function startVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Reconhecimento de voz não suportado neste navegador.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'pt-BR';

  recognition.onresult = function (event) {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    const lastWords = slides[currentSlide].split(/\s+/).slice(-4).join(' ').toLowerCase();

    if (transcript.includes(lastWords)) {
      currentSlide++;
      if (currentSlide < slides.length) {
        openProjectionWindow();
      } else {
        recognition.stop();
        alert('Apresentação finalizada.');
      }
    }
  };

  recognition.start();
}
