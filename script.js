/*
TODO: Different groups of songs & selection of them
TODO: Color presets [?]
TODO: Sequences


*/


// Getting references to everything 
const main = document.querySelector("main");
const progBar = document.querySelector(".progBar");
const overlay = document.querySelector(".overlay");
const curSong = document.querySelector(".curSong");
const motifDisplay = document.querySelector(".motifs");
const dykDisplay = document.querySelector(".dyk");
const nav = document.querySelector("nav ul");

const pauseBtn = document.querySelector("#pauseBtn");
const newSongBtn = document.querySelector("#newSongBtn");
const repeatBtn = document.querySelector("#repeatBtn");
const optionsBtn = document.querySelector("#optionsBtn");

const volume = document.querySelector("#volume");

// All songs
const songsData = await fetch("songs.json").catch(error => console.log(error));
const list = await songsData.json();


let globalAudio = new Audio();
let lastsList = new Array(60);
let progressBarAnim;
let paused = false;
let looped = false; // TODO

globalAudio.volume = volume.valueAsNumber;

function setSong(song) {
    // Loading the song
    globalAudio.src = `music/${song["filename"]}.mp3`;
    // globalAudio.preload = "metadata";
    globalAudio.load(); // Use the code above if doesn't work, Idk .-.

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

    console.log(lastsList);
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
    let randSong = list[reroll()];

    while (lastsList.includes(randSong)) {
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
    progressBarAnim = progBar.animate([
        { width: "0%" },
        { width: "100%" },
    ], globalAudio.duration * 1000);

    play();
};

volume.addEventListener("input", () => {
    globalAudio.volume = volume.valueAsNumber;
});

// Array.from(nav.children).forEach((li) => {
//     li.addEventListener("click", () => {
//         if (li.classList.contains("s")) {
//             li.classList.remove("s");
//         }
//         else {
//             li.classList.add("s");
//         }
//     });
// });
