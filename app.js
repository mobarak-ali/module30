const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const search = document.getElementById('search'); // Search Value
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const title = document.getElementById('title');// title
const dots = document.querySelector('.dots'); // dots 

// selected image 
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images at Gallery Section
const showImages = (images, query) => {
  // if images found after run the search
  if(images.length>0){
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';

    // Adds images to Gallery Section
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = `<img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
  }  else{ 
    // If no images found after the search
    imagesArea.style.display = 'none';
    title.innerHTML = `<i>${query}</i>- is your search text, we found no related image!`;
    title.style.color = "#ff0000";
    title.style.display = 'block';
  }
}
 
 const getImages = (query) => {
   // If the search field is left balnk
   if (query === "") {
      title.innerText = "Please type something to search the images";
      title.style.color = "#ff0000";
      title.style.display = 'block';
      gallery.innerHTML = '';
      imagesArea.style.display = 'none';
    } else{ // If a valid search is made
      title.style.display = 'none';
      title.innerText = "";
      search.value = "";
           
    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    // FIXED: Typo
    // .then(data => showImages(data.hitS))
    .then(data => showImages(data.hits, query)) 
    .catch(err => console.log(err))
   }
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    // alert('Hey, Already added !')
    sliders.splice(item, 1);  // Removes Selected Images
    element.classList.remove('added'); // Removes Class from Selected Images
  }
}
let timer; // var timer // Adding let and ; 
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }

  // Fixed ID typo from 'duration' to 'doration' on index.html
  const duration = document.getElementById('duration').value || 1000;
  
  // fixed sledr duration 
    if (duration<500){
      alert('Slidr Duration too Fast! Make it at least 500.');
      return;
    } 
  

  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';

  // hide image aria
  imagesArea.style.display = 'none';


  
  // const sliderContainer = document.getElementById('sliders');
  // const dots = document.querySelector('.dots'); // dots 
  dots.innerHTML = '';
  sliders.forEach((slide, i = 0) => {
    let item = document.createElement('div');
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100" src="${slide}"  alt="">`;
    sliderContainer.appendChild(item);

    // creats dots navigation
    const dot = `<span class="dot" onclick="changeSlide(${i++})"></span>`;
    let dotsContent = dots.innerHTML;
    dotsContent = dotsContent + dot;
    dots.innerHTML = dotsContent;

  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    // item.style.display = "none"
    // item.classList.remove('d-blook');
    item.classList.add('d-none');
  })

  // items[index].style.display = "block"
  items[index].classList.remove('d-none');
  // items[index].classList.add('d-block');
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})


// Search After Pressing Enter Button
search.addEventListener("keydown", function(event) {
  if (event.key === 'Enter') {
  //  event.preventDefault();
   searchBtn.click();
  }
});