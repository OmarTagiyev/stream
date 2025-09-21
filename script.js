/*
TODO: Different groups of songs & selection of them
TODO: Color presets [?]
TODO: Sequences


*/


// Getting references to everything 
const main = document.querySelector("main");
const progBar = document.querySelector("main .progBar");
const overlay = document.querySelector(".overlay");
const cover = document.querySelector(".cover");
const curSong = document.querySelector(".curSong");
const motifDisplay = document.querySelector(".motifs");
const dykDisplay = document.querySelector(".dyk");
const nav = document.querySelector("nav");
const categoriesSection = nav.querySelector("section.categories");
const colorSection = nav.querySelector("section.color");
const clrLeft = document.querySelector("input[type=\"color\"]#progbar-clr-l")
const clrRight = document.querySelector("input[type=\"color\"]#progbar-clr-r")

const pauseBtn = document.querySelector("#pauseBtn");
const newSongBtn = document.querySelector("#newSongBtn");
const optionsBtn = document.querySelector("#optionsBtn");

const volume = document.querySelector("#volume");

// All songs
const songsData = await fetch("songs.json").catch(error => console.log(error));
const list = await songsData.json();

let globalAudio = new Audio();
let lastsList = new Array(20);
let progressBarAnim;
let paused = false;
let allowedGroups = {
    "Ch1": true, // Chapter 1
    "Ch2": true, // Chapter 2
    "Ch3": false, // Chapter 3
    "Ch4": false, // Chapter 4
    "Ch5": false, // Chapter 5
    "Ch6": false, // Chapter 6
    "Ch7": false, // Chapter 7
    "Hdn": false, // Hidden
    "Wrd": false, // Weird Route

    approvesOf: function(arr) { // Checks if all tags in an array are true (turned on) in the group
        for (let i of arr) {
            if (!allowedGroups[i]) return false;
        }

        return true;
    }
};

allowedGroups

globalAudio.volume = volume.valueAsNumber;

function setSong(song) {
    if (progressBarAnim) { progressBarAnim.finish(); }
    curSong.textContent = "Loading..."

    // Loading the song
    globalAudio.src = `music/${song["filename"]}.mp3`;
    // globalAudio.preload = "metadata";
    globalAudio.load(); // Use the code above if doesn't work, Idk .-.
    // globalAudio.loop = true;

    curSong.textContent = song["title"];

    if (song["showfilename"] && song["filename"]) {
        curSong.textContent += ` aka ${song["filename"]}.ogg`;
    }

    if (song["motifs"].length != 0) {
        motifDisplay.textContent = `Motifs: ${song["motifs"].sort().join(", ")}`;
    } else {
        motifDisplay.textContent = ""
    }

    if (!song["dyk"] || song["dyk"] == []) {
        dykDisplay.textContent = "";
    }
    else {
        dykDisplay.textContent = `Did you know: ${song["dyk"][0]}`;
    }
}

function setSongByFilename(filename) {
    for (let song of list) {
        if (song["filename"] != filename) continue;
        
        setSong(song);
        break;
    }
}

function setSongByName(name) {
    for (let song of list) {
        if (song["title"] != name) continue;
        
        setSong(song);
        break;
    }
}

function setSongById(id) {
    setSong(list[id]);
}

function reroll() {
    return Math.floor(Math.random() * list.length);
}

function setRandomSong() {
    // if (allowedGroups.check())

    let randSong = list[reroll()];

    while (lastsList.includes(randSong) || !allowedGroups.approvesOf(randSong.group)) {
        randSong = list[reroll()];
    }

    lastsList.splice(0, 1);
    lastsList.push(randSong);

    setSong(randSong);
}

function play() {
    globalAudio.play();
    progressBarAnim.play();
    pauseBtn.querySelector("i").classList.remove("fa-play");
    pauseBtn.querySelector("i").classList.add("fa-pause");
}

function pause() {
    globalAudio.pause();
    progressBarAnim.pause();
    pauseBtn.querySelector("i").classList.remove("fa-pause");
    pauseBtn.querySelector("i").classList.add("fa-play");
}

newSongBtn.addEventListener("click", () => {
    setRandomSong();
    // setSongByFilename("church_wip");
});

pauseBtn.addEventListener("click", () => {
    if (paused) {
        play();
    }
    else {
        pause();
    }

    paused = !paused;
});

globalAudio.onended = () => {
    setRandomSong();
}

globalAudio.onloadedmetadata = () => {
    // Sets up an animation that can be played and paused later
    progressBarAnim = cover.animate([
        { width: "100%" },
        { width: "0%" },
    ], globalAudio.duration * 1000);
    
    play();
};

volume.addEventListener("input", () => {
    globalAudio.volume = volume.valueAsNumber;
});

Array.from(categoriesSection.querySelector("ul").children).forEach((li) => {
    li.addEventListener("click", () => {
        if (li.getAttribute("disabled") != null) return;

        if (li.classList.contains("s")) {
            li.classList.remove("s");
            allowedGroups[li.id] = false;
        }
        else {
            li.classList.add("s");
            allowedGroups[li.id] = true;
        }
    });
});

optionsBtn.addEventListener("click", () => {
    if (nav.style.display == "flex") {
        nav.style.display = "none";
        motifDisplay.style.display = "block";
        dykDisplay.style.display = "block";
    }
    else {
        nav.style.display = "flex";
        motifDisplay.style.display = "none";
        dykDisplay.style.display = "none";
    }
});

Array.from(colorSection.querySelector("ul").children).forEach((li) => {
    li.addEventListener("click", () => {
        Array.from(colorSection.querySelector("ul").children).forEach((el) => {
            el.classList.remove("s");
        });

        let colorspaces = ["rgb", "hsl-longer", "hsl-shorter", "lch", "oklch", "lab", "oklab"]

        colorspaces.forEach((colorspace) => {
            progBar.classList.remove(colorspace);
        });

        li.classList.add("s");

        progBar.classList.add(li.id);
    });
});

clrLeft.addEventListener("input", (e) => {
    document.body.style.setProperty("--progbar-lbar-clr", e.target.value);
});

clrRight.addEventListener("input", (e) => {
    document.body.style.setProperty("--progbar-rbar-clr", e.target.value);
});
