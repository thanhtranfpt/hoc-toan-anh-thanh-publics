const chat = document.getElementById("chat");
const inputText = document.getElementById('inputText');


async function sendMessage() {
    if (!inputText.value) {
        return
    }

    var data = {
        input_text: inputText.value,
        get_html: true
    };

    // Start send message:
    const message = document.createElement("div");
    message.classList.add("message", "text");
    message.innerHTML = inputText.value;
    chat.appendChild(message);
    // Auto-scroll to the bottom of the chat div
    chat.scrollTop = chat.scrollHeight;
    // Clear the input field after sending the message
    inputText.value = '';

    showLoading();

    var result = await fetch('/tro-ly-hoc-tap/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())

    hideLoading();

    // Now we will update what the user has typed, and the result from backend, and add it to the HTML body so the user can see both their text and result.
    const answer = document.createElement("div");
    answer.classList.add("message", "answer");
    answer.innerHTML = result;

    chat.appendChild(answer);
    
    // Auto-scroll to the bottom of the chat div
    chat.scrollTop = chat.scrollHeight;
}



inputText.addEventListener('keypress', async function(event) {
    if (event.key === 'Enter') {
        await sendMessage();
    }
});



showLoading();
fetch('/tro-ly-hoc-tap/chat/setup')
.then(response => response.text())
.then(result => {
    inputText.removeAttribute('readonly');
    hideLoading();
    console.log(result);
})
.catch(error => {
    inputText.removeAttribute('readonly');
    hideLoading();
    console.log(error);
});