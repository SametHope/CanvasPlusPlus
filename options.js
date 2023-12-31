let isOptionsOpen = false;

const optionsElement = document.getElementById('options');

if (isOptionsOpen) {
  optionsElement.style.display = 'block';
} else {
  optionsElement.style.display = 'none';
}


function toggleOptions() {
  optionsElement.style.display = optionsElement.style.display === 'none' ? 'block' : 'none';
  isOptionsOpen = optionsElement.style.display === 'block';

  const event = new CustomEvent('toggleoptions', { detail: { isOpen: isOptionsOpen } });
  document.dispatchEvent(event);
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    toggleOptions();
  }
});
