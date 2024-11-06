function renderPup(pup) {
    const dogBar = document.querySelector("#dog-bar");

    const newPup = document.createElement("span");
    newPup.textContent = pup.name;
    newPup.classList.add(pup.isGoodDog ? "good-dog" : "bad-dog");

    newPup.addEventListener("click", ()=> {

        const dogInfo = document.querySelector("#dog-info");
        dogInfo.className = pup.id;
        dogInfo.innerHTML = "";

        const dogImg = document.createElement("img");
        dogImg.src = pup.image;
        dogImg.alt = "dog";

        const dogName = document.createElement("h2");
        dogName.textContent = pup.name;

        const goodDogBtn = document.createElement("button");
        goodDogBtn.id = "good-dog-btn";
        goodDogBtn.textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!";
        goodDogBtn.addEventListener("click", () => {updateGoodDog()});

        dogInfo.append(dogImg, dogName, goodDogBtn);
    })

    dogBar.append(newPup);
}

function updateGoodDog() {
    const goodDogBtn = document.querySelector("#good-dog-btn");

    if (goodDogBtn.textContent === "Good Dog!") {
        goodDogBtn.textContent = "Bad Dog!"
        updatePup(false)
    }
    else {
        goodDogBtn.textContent = "Good Dog!"
        updatePup(true)
    }
}

function renderPups() {
    fetch("http://localhost:3000/pups")
    .then(res => res.json())
    .then(pups => {
        console.log(pups);
        pups.forEach(renderPup)})
    .catch(error => {console.log(error)});
}

function pupObject() {
    const dogInfo = document.querySelector("#dog-info");
    const goodDogBtn = dogInfo.querySelector("button")

    const isGoodDog = (goodDogBtn.textContent === "Good Dog!")

    return {id: dogInfo.className, 
            name: dogInfo.querySelector("h2").textContent,
            isGoodDog: isGoodDog,
            image: dogInfo.querySelector("img").src}
    }


function updatePup(isGoodDog) {
    const pup = pupObject();

    const pupEdited = { ...pup }

    pupEdited.isGoodDog = isGoodDog

    fetch(`http://localhost:3000/pups/${pupEdited.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pupEdited)
        })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then(pup => console.log("EDITED", pup))
        .catch(e => console.error(e))
      }

function filterGoodPups() {
    const filterBtn = document.querySelector("#good-dog-filter")

    filterBtn.addEventListener("click", (e) => {
        const constbtnTxt = e.target.textContent;
        const dogBar = document.querySelector("#dog-bar");

        const badDogs = Array.from(dogBar.children).filter(element => 
            element.classList.contains("bad-dog"));

        if (constbtnTxt === "Filter good dogs: OFF") {
            e.target.textContent = "Filter good dogs: ON";

            badDogs.forEach(dog => dog.classList.add("hide"));
        }
        else {
            e.target.textContent = "Filter good dogs: OFF";

            badDogs.forEach(dog => dog.classList.remove("hide"));
        }
    }
    )
}

document.addEventListener("DOMContentLoaded", () => {
    renderPups();
    filterGoodPups();
})