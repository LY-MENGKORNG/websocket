// URL Handler
const paramsString = window.location.search
const searchParams = new URLSearchParams(paramsString)
const client = searchParams.get("client")

const dialog = document.querySelector("dialog");
if (!client) {
	// Sign in dialog
	const closeButton = document.querySelector("dialog .close-button");

	dialog.showModal();

	closeButton.addEventListener("click", () => {
		dialog.close();
	});
} else {
	dialog.style.display = "none"
	// WS Instance
	const ws = new WebSocket(`ws://localhost:3000?client=${client}`)

	// DOM
	const sendButton = document.getElementById("send")
	const messageInput = document.getElementById("message")
	const listGroup = document.querySelector(".list-group")
	const clientName = document.querySelector(".title b")

	messageInput.focus()
	clientName.textContent = client

	sendButton.addEventListener("click", (event) => {
		event.preventDefault()
		if (messageInput.value === "") {
			return messageInput.focus()
		}
		ws.send(messageInput.value)
		messageInput.value = ""
	})

	ws.onmessage = (event) => {
		listGroup.append(createListItem(JSON.parse(event.data)))
	};

	function createListItem(data) {
		const listItem = document.createElement("span")
		listItem.className = "list-item"

		if (data.client === client) {
			listItem.classList.add("left")
			listItem.textContent = data.message
		} else {
			listItem.innerHTML = `<b>${data.client}</b>: ${data.message}`
		}

		return listItem
	}
}
