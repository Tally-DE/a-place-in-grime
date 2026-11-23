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

const packetFiles = document.querySelector('#packet-files');
if (packetFiles && window.crypto?.randomUUID) {
  packetFiles.hidden = false;
  const receipts = new Map();
  const results = packetFiles.querySelector('ol');
  const status = packetFiles.querySelector('[role="status"]');
  const button = packetFiles.querySelector('button');
  packetFiles.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled) return;
    button.disabled = true;
    const files = Array.from(packetFiles.elements.files.files);
    const credit = packetFiles.elements.credit.value;
    let accepted = 0;
    for (const [index, file] of files.entries()) {
      status.textContent = `Checking file ${index + 1} of ${files.length}…`;
      const row = document.createElement('li');
      try {
        if (file.size > 180000) throw new Error('This file is too large for one packet.');
        const note = await file.text();
        if (note.length > 45000) throw new Error('Keep each question under 45,000 characters.');
        const packet = JSON.parse(note);
        if (packet?.version !== 4 || !packet.task_id) throw new Error('Choose a version 4 artist packet.');
        const key = JSON.stringify([credit,note]);
        const receipt = receipts.get(key) || {token: crypto.randomUUID(), url: ''};
        receipts.set(key, receipt);
        if (!receipt.url) {
          const response = await fetch('/packet', {method:'POST',body:new URLSearchParams({note,credit,token:receipt.token})});
          if (!response.ok) {
            const page = new DOMParser().parseFromString(await response.text(),'text/html');
            throw new Error(page.querySelector('[role="alert"]')?.textContent || 'Could not confirm delivery. Retry this file.');
          }
          const target = new URL(response.url);
          if (target.origin !== location.origin || target.pathname !== '/receipt/'+receipt.token) throw new Error('No receipt returned. Retry this file.');
          receipt.url = target.pathname;
        }
        const anchor = document.createElement('a');
        anchor.href = receipt.url;
        anchor.textContent = file.name+' — private receipt';
        if (!results.querySelector('a[href="'+receipt.url+'"]')) {
          row.append(anchor);
          results.append(row);
        }
        accepted++;
      } catch (error) {
        row.textContent = file.name+' — '+(error instanceof SyntaxError?'This file could not be read as JSON.':error.message);
        results.append(row);
      }
    }
    status.textContent = `${accepted} of ${files.length} files received. Save the receipt links before leaving.`;
    button.disabled = false;
  });
}
