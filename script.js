'use strict';

///////////////////////////////////////

// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');


const openModal = function (e) {
  e.preventDefault(); //page jump to start whenever we click hem to remove that default behavior of link we use this statement
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnsOpenModal.forEach(Eachbtn => Eachbtn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//               >>>>>>>>>>>>>>>>>>>>  page scrolling  >>>>>>>>>>>>>>>>>>>>>>>>>>

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  //getBoundingClientRect: Return the size of an element and its position relative to the viewport
  // console.log(section1.getBoundingClientRect());
  // console.log(e.target.getBoundingClientRect());
  //section1.scrollIntoView({ behavior: "smooth", block: "start" });
  //scrollIntoView: The Element interface's scrollIntoView() method scrolls the element's parent container such that the element on which scrollIntoView() is called is visible to the user
  section1.scrollIntoView({ behavior: 'smooth', block: "start" });
});

//                >>>>>>>>>>>>>>>>>>>>  Page Navigation  >>>>>>>>>>>>>>>>>>>>>>>>>>

// document.querySelectorAll('.nav__link').forEach(function (elem) {
//   elem.addEventListener('click', function (e) {
//     e.preventDefault(); //bcz browser which ids automaticaaly move to that place to the achor we defied in the html
//     //for smooth scrolling
//     const id = this.getAttribute('href'); //bcz we want absolute href so we dont write this.href
//     //console.log(id); output: #section1 #section2 #section3
//     //document.querySelector(id).scrollIntoView({ behavior: 'smooth', start: 'start' });--> not efficient
//   });
// });
//event delegation->>follow 2 steps->>
//1.we add event listener to the parent element of the the elements we are intrested in
//2.determine which element originated the event.

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //where the event actully happened???-->so this thing is stroed inside e object's target property...
  if (e.target.classList.contains('nav__link')) { //when we click between the nav random thing is returned and we dont need that
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); //here by behavior is not working...
  }
});

//operations portion..

const tabsContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabContent = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener('click', function (e) {

  const clicked = e.target.closest('.operations__tab');
  //Remove
  tabs.forEach(tc => tc.classList.remove("operations__tab--active"));
  tabContent.forEach(tabc => tabc.classList.remove("operations__content--active"));
  //add
  clicked.classList.add("operations__tab--active");
  //console.log(clicked.dataset.tab);
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");

});

//Nav fade animation
const Nav = document.querySelector(".nav");

Nav.addEventListener('mouseover', function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll(".nav__link");
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(siblingsElem => {
      if (siblingsElem != link)
        siblingsElem.style.opacity = 0.5;
    });
  }
});
Nav.addEventListener('mouseout', function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll(".nav__link");
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(siblingsElem => {
      siblingsElem.style.opacity = 1;
    });
  }
});

//sticky Navigation
/*
const sec1cords = section1.getBoundingClientRect();     // this will give us current position of section1 wrt to viewport
//but scrollY tells s about how much we scrolled upwards and downwards, not exactly the position of section1
window.addEventListener('scroll', function () {
  console.log(sec1cords);
  console.log(window.scrollY);
  if (window.scrollY > sec1cords.top)
    Nav.classList.add('sticky');
  else Nav.classList.remove('sticky');
});
*/
//sticky Navigation in more effecient and effective way..

const TargetHeader = document.querySelector(".header");
const navHeight = Nav.getBoundingClientRect().height;

const callbackFun = function (entries, observeHeader) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    Nav.classList.add('sticky');
  } else Nav.classList.remove('sticky');
}

const observer = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
};

const observeHeader = new IntersectionObserver(callbackFun, observer);
observeHeader.observe(TargetHeader);

//Lazy Appearing Section

const selectAllSec = document.querySelectorAll(".section");

const callbackSec = function (entries) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
}

const ObserverAllSection = new IntersectionObserver(callbackSec, {
  root: null,
  threshold: 0.15,
});

selectAllSec.forEach(function (sec) {
  ObserverAllSection.observe(sec);
  sec.classList.add("section--hidden");
});

//Lazy images in feature section
const All_imgs = document.querySelectorAll("img[data-src]");//we are selecting all the img tag which has attribute of data-src 

const LazyImgCB = function (entries, observer) {
  const [entry] = entries;
  //Replacing src with dataset-src
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  //this happens behind the scenes,javascript finds the new images
  //and once its finieshed loading that image..it will emit the "load event".load event is just like any other event and so we can just listen for it and do something with image
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
}

const observeLazyImg = new IntersectionObserver(LazyImgCB, {
  root: null,
  threshold: 0.3,
  rootMargin: `-200px`
});

All_imgs.forEach(cimg => {
  observeLazyImg.observe(cimg);
});

//          >>>>>>>>>>>>>>>>>>>>>>>>Slider>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const btn_right = document.querySelector(".slider__btn--right");
const btn_left = document.querySelector(".slider__btn--left");
const dotContainer = document.querySelector(".dots");
let current_slide = 0;

slides.forEach(function (s, i) {
  s.style.transform = `translateX(${i * 100}%)`
});

const slideIt = function (curr_slide) {
  slides.forEach(function (s, i) {
    s.style.transform = `translateX(${(i - curr_slide) * 100}%)`
  });
}
const slideToRight = function () {
  if (current_slide < slides.length - 1)
    current_slide++;
  else current_slide = 0;
  slideIt(current_slide);
}
const slideToLeft = function () {
  if (current_slide > 0)
    current_slide--;
  else current_slide = slides.length - 1;
  slideIt(current_slide);
}

btn_right.addEventListener("click", slideToRight);
btn_left.addEventListener("click", slideToLeft);

slides.forEach((_, i) => {
  dotContainer.insertAdjacentHTML("beforeend",
    `<button class="dots__dot" data-slide="${i}"></button>`);
});

document.querySelector(".dots").addEventListener('click', function (e) {
  if (!e.target.classList.contains("dots__dot")) return;
  //const slide=e.target.dataset.slide -->> same meaning as written below onlu diff is since left and right side has same name so we use curly braces instead and write slide on one time there
  const { slide } = e.target.dataset; //destructing -->gives us current slide on which we are clicking
  slideIt(slide);

  document.querySelectorAll(".dots__dot").forEach(
    d => {
      return d.classList.remove("dots__dot--active");
    });
  //document.querySelector(`.data-slide=${slide}`).classList.add("dots__dot--active");
  //Uncaught DOMException: Failed to execute 'querySelector' on 'Document': '.data-slide=2' is not a valid selector.
  //Then how to select button with the help of dataset

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active");
  //above statement says select the class dots__dot which has attribute of d(ataset) data-slide=particular value.
});

