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
