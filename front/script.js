const chatBox = document.getElementById("chatBox")
const input = document.getElementById("messageInput")
const sendBtn = document.getElementById("sendBtn")
const counter = document.getElementById("charCount")

function formatMessage(text) {

    const safe = text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")

    const imgRegex = /(https?:\/\/.*\.(png|jpg|jpeg|gif|webp))/i
    const urlRegex = /(https?:\/\/[^\s]+)/g

    const imgMatch = safe.match(imgRegex)

    if (imgMatch) {
        const url = imgMatch[0]
        return safe.replace(url, `<a href="${url}" target="_blank">${url}</a>`) +
            `<img class="preview" src="${url}">`
    }

    return safe.replace(urlRegex, u => `<a href="${u}" target="_blank">${u}</a>`)
}

async function loadMessages() {

    const res = await fetch("/api/messages")
    const data = await res.json()

    const atBottom =
        chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 50

    chatBox.innerHTML = ""

    data.forEach(m => {
        const div = document.createElement("div")
        div.className = "message"

        div.innerHTML =
            `<span class="user">${m.user}:</span>
        <span class="text">${formatMessage(m.text)}</span>`

        chatBox.appendChild(div)
    })

    if (atBottom) {
        chatBox.scrollTop = chatBox.scrollHeight
    }
}

async function sendMessage() {

    const text = input.value.trim()
    if (!text) return

    await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user: "Antony Saz",
            text: text
        })
    })

    input.value = ""
    counter.textContent = "0 / 140"

    loadMessages()
}

input.addEventListener("input", () => {
    counter.textContent = input.value.length + " / 140"
})

input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault()
        sendMessage()
    }
})

sendBtn.addEventListener("click", sendMessage)

loadMessages()
setInterval(loadMessages, 1000)