AOS.init();

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDV9d6m91mfO9tq4k8n8Ra0MTYJ6nLbI7A",
  authDomain: "telawa-cefbd.firebaseapp.com",
  projectId: "telawa-cefbd",
  storageBucket: "telawa-cefbd.appspot.com",
  messagingSenderId: "798058374760",
  appId: "1:798058374760:web:979669441c07df67effddd",
  measurementId: "G-HLPL9J5TJ1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // Initialize Firebase Storage

function getFileNameWithoutExtension(fileName) {
  return fileName.split(".").slice(0, -1).join(".").replace(/_+/g, " "); // Removes underscores
}

// Function to create audio players dynamically for each file
function createAudioPlayer(url, fileName) {
  const audioContainer = document.createElement("div");
  audioContainer.classList.add("audio-container");

  // Create audio element
  const audioPlayer = document.createElement("audio");
  audioPlayer.controls = true;
  audioPlayer.src = url;

  // Create download button
  const downloadButton = document.createElement("button");
  downloadButton.classList.add("download-file");
  downloadButton.innerText = "Download";
  downloadButton.addEventListener("click", () => {
    // Fetch the file as a blob and trigger the download
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a blob URL and trigger the download directly
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName; // Specify the file name for download
        link.click(); // Automatically trigger the download
      })
      .catch((error) => {
        console.error("Error downloading the file:", error);
      });
  });

  // Show the file name without extension
  const fileTitle = document.createElement("p");
  fileTitle.innerText = getFileNameWithoutExtension(fileName);

  // Append file title, audio player, and button to the audio container
  audioContainer.appendChild(fileTitle);
  audioContainer.appendChild(audioPlayer);
  audioContainer.appendChild(downloadButton);

  return audioContainer;
}

// Function to list all files in a given folder and append to the section with id "content"
function listFilesInSpecificFolder(folderName) {
  const contentDiv = document.getElementById("content"); // Get the content section
  contentDiv.innerHTML = ""; // Clear existing content

  const folderRef = ref(storage, folderName); // Reference to the specific folder

  listAll(folderRef)
    .then((res) => {
      // Loop through all files in the folder
      const promises = res.items.map((itemRef) => {
        return getDownloadURL(itemRef).then((url) => {
          const audioContainer = createAudioPlayer(url, itemRef.name);
          contentDiv.appendChild(audioContainer); // Append audio container to content section
        });
      });

      // Once all content is added, smoothly scroll to the section
      Promise.all(promises).then(() => {
        contentDiv.scrollIntoView({ behavior: "smooth" });
      });
    })
    .catch((error) => {
      console.log("Error listing files: ", error);
    });
}
let audioPlayers = []; // Store references to all active audio players

// Function to pause all other audio players
function pauseOtherAudioPlayers(currentAudioPlayer) {
  audioPlayers.forEach((player) => {
    if (player !== currentAudioPlayer) {
      player.pause();
    }
  });
}

// Function to add event listeners to all audio players on the page
function handleAudioPlayers(audioPlayer) {
  // Add event listener to stop other audio players when this one is played
  audioPlayer.addEventListener("play", () => {
    pauseOtherAudioPlayers(audioPlayer);
  });

  // Add this audio player to the list of active players if not already added
  if (!audioPlayers.includes(audioPlayer)) {
    audioPlayers.push(audioPlayer);
  }
}

// Initial function to attach listeners to all existing audio players
function handleAllAudioPlayers() {
  const allAudioPlayers = document.querySelectorAll("audio");
  allAudioPlayers.forEach((audioPlayer) => handleAudioPlayers(audioPlayer));
}

// Call this function to handle audio players already on the page
handleAllAudioPlayers();

// Use a MutationObserver to detect when new audio elements are added dynamically
const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.tagName === "AUDIO") {
        // New audio player detected, handle it
        handleAudioPlayers(node);
      }
    });
  });
});

// Observe changes in the body of the document (or the specific container where audio players are added)
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("DOMContentLoaded", function () {
  // Ensure the onclick is set after DOM is loaded
  document.getElementById("abdelbast").onclick = function () {
    listFilesInSpecificFolder("abdelbast");
  };
  document.getElementById("elmenshawy").onclick = function () {
    listFilesInSpecificFolder("elmenshawy");
  };
  document.getElementById("sa3ed").onclick = function () {
    listFilesInSpecificFolder("sa3ed");
  };
  document.getElementById("tablawy").onclick = function () {
    listFilesInSpecificFolder("tablawy");
  };
});
