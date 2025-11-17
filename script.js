function mostrarMiniaturas(slides) {
  const container = document.getElementById('todosSlides');
  container.innerHTML = '';

  slides.forEach((slide, index) => {
    const miniatura = document.createElement('div');
    miniatura.className = 'miniatura';

    const titulo = slide.split('\n')[0] || `Slide ${index + 1}`;
    const preview = slide.length > 100 ? slide.slice(0, 100) + '...' : slide;

    miniatura.innerHTML = `<h4>${titulo}</h4><p>${preview}</p>`;
    miniatura.onclick = () => {
      mostrarSlideAtual(index);
      destacarMiniatura(index);
    };
    container.appendChild(miniatura);
  });
}

function destacarMiniatura(index) {
  const todas = document.querySelectorAll('.miniatura');
  todas.forEach((el, i) => {
    el.classList.toggle('ativa', i === index);
  });
}
