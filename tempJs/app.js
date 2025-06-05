const getJokeBtn = document.getElementById("getJoke");
const jokeBox = document.getElementById("jokeBox");
const categorySelect = document.getElementById("category");

getJokeBtn.addEventListener("click", async (params) => {
    const category = categorySelect.value;
    jokeBox.innerHTML = "Loading Joke...";

    function getEmoji(category) {
        const emojis = {
            Programming: ["💻", "🧠", "🖥️", "👨‍💻", "👩‍💻"],
            Dark: ["🌑", "🕷️", "🖤", "☠️", "👻"],
            Pun: ["😹", "😂", "🤣", "😆", "😜"],
            Spooky: ["👻", "🧟", "🎃", "🦇", "🕸️"],
            Any: ["🤣", "😂", "😅", "🎉", "😄"]
        };

        const selected = emojis[category] || emojis["Any"];
        return selected[Math.floor(Math.random() * selected.length)];
    }


    try {
        const res = await fetch(`https://v2.jokeapi.dev/joke/${category}?type=twopart`);
        const data = await res.json();
        if (!res.ok || data.error) {
            throw new Error("Failed to fetch joke.")
        }
        const emoji = getEmoji(category);
        jokeBox.innerHTML = `
        <p><strong>${data.setup}</strong></p>
        <p>${data.delivery}</p>
          <button id="saveJoke">Save</button>
          <button id="shareJoke">Share</button>
`
        document.getElementById("saveJoke").addEventListener("click", () => {
            const saved = JSON.parse(localStorage.getItem("savedJokes")) || [];
            saved.push({ setup: data.setup, delivery: data.delivery });
            localStorage.setItem("savedJokes", JSON.stringify(saved));
            alert("Joke saved!");
        });

        document.getElementById("shareJoke").addEventListener("click", function(){
            const text = `${data.setup} - ${data.delivery}`
            const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
            window.open(url, "_blank")
 
        })


    } catch (error) {
        jokeBox.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;


    }
})