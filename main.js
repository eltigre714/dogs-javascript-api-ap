let timer
let deleteFirstPhotoDelay

// Breed list
async function start() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all")
        const data = await response.json()
        createBreedList(data.message)
    } catch (e) {
        console.log("There was a problem fetching the breed list.")  // Display message if there is a technical issue. 
    }
}

start()

function createBreedList(breedList) {
    document.getElementById("breed").innerHTML = `
    <select onchange="loadByBreed(this.value)">
        <option>Choose a dog breed</option>
        ${Object.keys(breedList).map(function (breed) {
            return `<option>${breed}</option>`
        }).join('')}
        </select>
    `
}
// Load images per breed
async function loadByBreed(breed) {
    if (breed != "Choose a dog breed") {
        // fetch the dog breed selected
        const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`)
        const data = await response.json()
        createSlideShow(data.message)
    }
}

function createSlideShow(images) {
    let currentPosition = 0  // Starting image position
    clearInterval(timer) 
    clearTimeout(deleteFirstPhotoDelay)  // clear last selection timer, if new photo is selected

    // if images are greater than 1, keep displaying images 
    if (images.length > 1) {
        document.getElementById("slideshow").innerHTML = `
    <div class="slide" style="background-image: url('${images[0]}')"></div>
    <div class="slide" style="background-image: url('${images[1]}')"></div>
    `
    currentPosition += 2  // after 2 slides displayed, add 2
    if (images.length == 2) currentPosition = 0 // If there are only 2 total images available, set current position back to 0 to display first image again
    timer = setInterval(nextSlide, 3000)  // advance 1 more image every 3 seconds

    } else {
        document.getElementById("slideshow").innerHTML = `
    <div class="slide" style="background-image: url('${images[0]}')"></div>
    <div class="slide"></div>
    `
    }

    function nextSlide() {
        document.getElementById("slideshow").insertAdjacentHTML("beforeend", `<div class="slide" style="background-image: url('${images[currentPosition]}')"></div>`)
        deleteFirstPhotoDelay = setTimeout(function () {
            document.querySelector(".slide").remove() // remove oldest image
        }, 1000) 
        // after final image has been displayed, display first image back
        if (currentPosition + 1 >= images.length) {
            currentPosition = 0
        } else {
            currentPosition++
        }
    }
}