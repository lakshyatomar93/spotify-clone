let currentsong = new Audio();

let songs;
let currfolder;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0)
        return "00:00";

    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function getsongs(folder) {
    currfolder = folder;

    const response = await fetch(`./${folder}/songs.json`);
    songs = await response.json();

    let songul = document.querySelector(".songlist ul");
    songul.innerHTML = "";

    for (const song of songs) {
        let displayname = decodeURIComponent(song)
            .replaceAll("%5", " ")
            .replaceAll(/\d/g, "")
            .replaceAll("-", " ")
            .replaceAll("C", "")
            .replaceAll(".mp", "");

        songul.innerHTML += `
        <li data-song="${song}">
            <img src="svgfolder/music1.svg" class="svg" alt="">
            <div class="info">
                <div>${displayname}</div>
            </div>
            <div class="playnow">
                <span>Play now</span>
                <img src="svgfolder/play.svg" class="svg" alt="">
            </div>
        </li>`;
    }

    Array.from(songul.getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            document.querySelector(".playbar").style.display = "block";
            playMusic(e.dataset.song);
        });
    });

    return songs;
}

// async function getsongs(folder) {
//     console.log("getsongs called");
//     currfolder = folder;
//     // let a = fetch(`http://127.0.0.1:3000/${folder}/`);
//     let a = fetch(`./${folder}/`);

//     let response = await (await a).text();
//     console.log(response);
//     let div = document.createElement("div");

//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a");
    
//     songs = [];
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         console.log(element.href);
//         if (element.href.endsWith("mp3")) {
//             songs.push(
//                 decodeURIComponent(element.href).replace(/\\/g, "/").split("/").pop());
//         }
//     }
//     let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
//     songul.innerHTML = ""
//     for (const song of songs) {
//         var displayname = song
//             .replaceAll("%5", " ")
//             .replaceAll(/\d/g, "")
//             .replaceAll("-", " ")
//             .replaceAll("C", "")
//             .replaceAll(".mp", "")

//         songul.innerHTML = songul.innerHTML + `<li data-song="${song}" >
//         <img src="svgfolder/music1.svg" class="svg" alt="music logo">
//         <div class="info">
//         <div>${displayname}</div>
//         </div>
//         <div class="playnow">
//         <span>Play now</span>
//         <img src="svgfolder/play.svg" class="svg" alt="">
//         </div>
//         </</li>`;
//     }

//     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

//         e.addEventListener("click", element => {
//             document.querySelector(".playbar").style.display = "block";
//             playMusic(e.dataset.song);

//         })
//     });

//     return songs;
// }

const playMusic = (track, pause = false) => {


    // let audio = new Audio("/songs/" + track);
    let displayName = decodeURI(track)
        .replace(/^\\/, "")
        .replaceAll("%5", " ")
        .replaceAll(/\d/g, "")
        .replaceAll("-", " ")
        .replaceAll("C", "")
        .replaceAll(".mp", "")
        .trim();
    // console.log(displayName);

    document.querySelector(".songinfo").textContent = displayName;
    currentsong.src = `./${currfolder}/${track}`;
    if (!pause) {
        currentsong.play();
        play.src = "svgfolder/pause.svg";
    }
    // document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    await getsongs("songs/cs");
    console.log(Array.isArray(songs));
    console.log(typeof songs);
    console.log(songs);
    playMusic(songs[0], true)





    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "svgfolder/pause.svg"
        }
        else {
            currentsong.pause();
            play.src = "svgfolder/play.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";

        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        if (document.querySelector(".left").style.left == "-120%") {
            document.querySelector(".left").style.left = "0"
        }
        else {
            document.querySelector(".left").style.left = "-120%"
        }
    })

    console.log("Songs =", songs);
console.log("Current Folder =", currfolder);
console.log("Current src =", currentsong.src);
    previous.addEventListener("click", () => {
        console.log("prvious");
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if (index === 0) {
            playMusic(songs[songs.length - 1]);
        }
        else {
            playMusic(songs[index - 1]);
        }
    })


    next.addEventListener("click", () => {
        console.log("next");
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if (index < songs.length - 1)
            playMusic(songs[index + 1]);
        else {
            playMusic(songs[0]);
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100
    })

    document.querySelector(".sound img").addEventListener("click", (e) => {
        const sound = document.querySelector(".sound img");
        if (sound.src.includes("sound.svg")) {
            sound.src = "svgfolder/mute.svg";
            currentsong.muted = true;
            // play.src = "svgfolder/play.svg"
            // document.querySelector(".circle").
            // sound.currentsong.paused();
        }
        else {
            sound.src = "svgfolder/sound.svg";
            currentsong.muted = false;
            // play.src = "svgfolder/pause.svg"
            // currentsong.play();
        }
    })

    Array.from(document.getElementsByClassName("music")).forEach((e) => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
            document.querySelector(".songlist ul").style.display = "block";
            document.querySelector(".library").style.display = "none";
            document.querySelector(".library2").style.display = "none";


        })
    })



}

main();