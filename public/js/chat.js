const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML

const messageTemplateMy = document.querySelector("#message-my").innerHTML
const locationMessageTemplateMy = document.querySelector("#my-location-message-template").innerHTML

const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

const {username, room, key} = Qs.parse(location.search, {ignoreQueryPrefix: true})
//console.log(username);

socket.emit("join", {username,room,key}, (error) => {
    if(error){
        alert(error);
        location.href = "/";
    }
});

socket.on("message", (message) =>{
    const {username} = Qs.parse(location.search, {ignoreQueryPrefix: true})
    //console.log(message);
    // console.log(username);
    // console.log(message.username);
    // console.log(username.toLowerCase() == message.username)
    if(username.toLowerCase() == message.username){
        const html = Mustache.render(messageTemplateMy, {message: message.text, createdAt : moment(message.createdAt).format("h:mm a")});
            $messages.insertAdjacentHTML("beforeend", html);
            autoscroll();
    }
    if(username.toLowerCase() != message.username){
        const html = Mustache.render(messageTemplate, {username: message.username ,message: message.text, createdAt : moment(message.createdAt).format("h:mm a")});
            $messages.insertAdjacentHTML("beforeend", html);
            autoscroll();
    }
})

$messageForm.addEventListener("submit", (e) => {
    //alert("hello!");
    e.preventDefault();
    $messageFormButton.setAttribute("disabled", "disabled");
    //console.log("==> " + text.value);
    const message = e.target.elements.message.value;
    socket.emit("sendMessage", message, (error) => {

        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();

        if(error){
            return alert(error);
        }
        console.log("Delivered");
    });
});

socket.on("locationMessage", (location) =>{
    //console.log(location);
    if(username.toLowerCase() == location.username){
        const html = Mustache.render(locationMessageTemplateMy, {location:location.url, createdAt : moment(location.createdAt).format("h:mm a")});
        $messages.insertAdjacentHTML("beforeend", html);
        autoscroll();
    }
    if(username.toLowerCase() != location.username){
        const html = Mustache.render(locationMessageTemplate, {username: location.username ,location:location.url, createdAt : moment(location.createdAt).format("h:mm a")});
        $messages.insertAdjacentHTML("beforeend", html);
        autoscroll();
    }
})

$sendLocationButton.addEventListener("click", () => {
    if(!navigator.geolocation){
        return alert("Location sharing is currently not supported by our browser. Try to update it or try with another browser.");
    }

    $sendLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position);
        //console.log(latitude + " " + longitude);
        socket.emit("sendLocation", {latitude: position.coords.latitude, longitude: position.coords.longitude}, (message) => {
            console.log(message);
            $sendLocationButton.removeAttribute("disabled");
        });
    })
});

socket.on("roomData", ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {room , users});
    document.querySelector("#sidebar").innerHTML = html;
});

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}