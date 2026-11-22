const button = document.querySelector('#next');
if (button) {
  const frames = [
    ['trim-flowdan.jpg','Trim & Flowdan, 2005','34882249','Two MCs holding microphones at the front of the stage.'],
    ['jammer-ears.jpg','Jammer & Ears, 2005','15112120','Two MCs under red ceiling beams, one leaning into a wired microphone.']
  ];
  let index = 0;
  button.addEventListener('click', () => {
    index = (index + 1) % frames.length;
    const [file,title,id,alt] = frames[index];
    const photo = document.querySelector('#photo');
    photo.src = '/assets/' + file;
    photo.alt = alt;
    document.querySelector('#caption').textContent = title;
    document.querySelector('#source').href = 'https://www.flickr.com/photos/believekevin/' + id + '/';
  });
}

const briefForm = document.querySelector('#brief-form');
if (briefForm) {
  const {duration, minutes} = briefForm.elements;
  function showTimeLimit() {
    const custom = duration.value === 'Custom time';
    minutes.closest('label').hidden = !custom;
    minutes.disabled = !custom;
    minutes.required = custom;
  }
  duration.addEventListener('change', showTimeLimit);
  window.addEventListener('pageshow', showTimeLimit);
  showTimeLimit();
}

const copyPrompt = document.querySelector('#copy-prompt');
if (copyPrompt) {
  copyPrompt.hidden = false;
  copyPrompt.addEventListener('click', async () => {
    const prompt = document.querySelector('#agent-prompt');
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(prompt.value);
      status.textContent = 'Copied. Paste it into your agent when you’re ready.';
    } catch {
      prompt.focus();
      prompt.select();
      status.textContent = 'The prompt is selected. Use your device’s Copy command.';
    }
  });
}
