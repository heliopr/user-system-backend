// GET FRIENDS
{
    const getFriends = document.getElementById("get-friends")
    const idInp = getFriends.querySelector("#id")
    const sendButton = getFriends.querySelector("#send")
    const clearButton = getFriends.querySelector("#clear")
    const request = getFriends.querySelector("#request")
    const response = getFriends.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const id = idInp.value
        let url = `/api/getFriends/?id=${id}`


        const res = await (await fetch(url, {
            method: "GET",
            headers: {'Accept': 'application/json'}
        })).json()

        request.textContent = url
        response.textContent = JSON.stringify(res)
    })

    clearButton.addEventListener("click", () => {
        request.textContent = ""
        response.textContent = ""
    })
}

// REMOVE FRIEND
{
    const removeFriend = document.getElementById("remove-friend")
    const friendInp = removeFriend.querySelector("#friend")
    const idInp = removeFriend.querySelector("#id")
    const cookieInp = removeFriend.querySelector("#cookie")
    const sendButton = removeFriend.querySelector("#send")
    const clearButton = removeFriend.querySelector("#clear")
    const request = removeFriend.querySelector("#request")
    const response = removeFriend.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const friend = parseInt(friendInp.value)
        const id = parseInt(idInp.value)
        const cookie = cookieInp.value
        
        const req = JSON.stringify({friend: friend, id: id, cookie: cookie})

        const res = await (await fetch("/api/removeFriend", {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: req
        })).json()

        request.textContent = req
        response.textContent = JSON.stringify(res)
    })

    clearButton.addEventListener("click", () => {
        request.textContent = ""
        response.textContent = ""
    })
}

// SEND FRIEND REQUEST
{
    const sendFriendRequest = document.getElementById("send-friend-request")
    const senderInp = sendFriendRequest.querySelector("#sender")
    const targetInp = sendFriendRequest.querySelector("#target")
    const cookieInp = sendFriendRequest.querySelector("#cookie")
    const sendButton = sendFriendRequest.querySelector("#send")
    const clearButton = sendFriendRequest.querySelector("#clear")
    const request = sendFriendRequest.querySelector("#request")
    const response = sendFriendRequest.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const sender = parseInt(senderInp.value)
        const target = parseInt(targetInp.value)
        const cookie = cookieInp.value
        
        const req = JSON.stringify({sender: sender, target: target, cookie: cookie})

        const res = await (await fetch("/api/sendFriendRequest", {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: req
        })).json()

        request.textContent = req
        response.textContent = JSON.stringify(res)
    })

    clearButton.addEventListener("click", () => {
        request.textContent = ""
        response.textContent = ""
    })
}

// GET SENT FRIEND REQUESTS
{
    const getSentFriendRequests = document.getElementById("get-sent-friend-requests")
    const idInp = getSentFriendRequests.querySelector("#id")
    const cookieInp = getSentFriendRequests.querySelector("#cookie")
    const sendButton = getSentFriendRequests.querySelector("#send")
    const clearButton = getSentFriendRequests.querySelector("#clear")
    const request = getSentFriendRequests.querySelector("#request")
    const response = getSentFriendRequests.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const id = idInp.value
        const cookie = cookieInp.value
        let url = `/api/getSentFriendRequests/?id=${id}&cookie=${cookie}`


        const res = await (await fetch(url, {
            method: "GET",
            headers: {'Accept': 'application/json'}
        })).json()

        request.textContent = url
        response.textContent = JSON.stringify(res)
    })

    clearButton.addEventListener("click", () => {
        request.textContent = ""
        response.textContent = ""
    })
}

// GET PENDING FRIEND REQUESTS
{
    const getPendingFriendRequests = document.getElementById("get-pending-friend-requests")
    const idInp = getPendingFriendRequests.querySelector("#id")
    const cookieInp = getPendingFriendRequests.querySelector("#cookie")
    const sendButton = getPendingFriendRequests.querySelector("#send")
    const clearButton = getPendingFriendRequests.querySelector("#clear")
    const request = getPendingFriendRequests.querySelector("#request")
    const response = getPendingFriendRequests.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const id = idInp.value
        const cookie = cookieInp.value
        let url = `/api/getPendingFriendRequests/?id=${id}&cookie=${cookie}`


        const res = await (await fetch(url, {
            method: "GET",
            headers: {'Accept': 'application/json'}
        })).json()

        request.textContent = url
        response.textContent = JSON.stringify(res)
    })

    clearButton.addEventListener("click", () => {
        request.textContent = ""
        response.textContent = ""
    })
}

// CANCEL FRIEND REQUEST
{
    const cancelFriendRequest = document.getElementById("cancel-friend-request")
    const targetInp = cancelFriendRequest.querySelector("#target")
    const idInp = cancelFriendRequest.querySelector("#id")
    const cookieInp = cancelFriendRequest.querySelector("#cookie")
    const sendButton = cancelFriendRequest.querySelector("#send")
    const clearButton = cancelFriendRequest.querySelector("#clear")
    const request = cancelFriendRequest.querySelector("#request")
    const response = cancelFriendRequest.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const target = parseInt(targetInp.value)
        const id = parseInt(idInp.value)
        const cookie = cookieInp.value
        
        const req = JSON.stringify({target: target, id: id, cookie: cookie})

        const res = await (await fetch("/api/cancelFriendRequest", {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: req
        })).json()

        request.textContent = req
        response.textContent = JSON.stringify(res)
    })

    clearButton.addEventListener("click", () => {
        request.textContent = ""
        response.textContent = ""
    })
}

// ACCEPT FRIEND REQUEST
{
    const acceptFriendRequest = document.getElementById("accept-friend-request")
    const senderInp = acceptFriendRequest.querySelector("#sender")
    const idInp = acceptFriendRequest.querySelector("#id")
    const cookieInp = acceptFriendRequest.querySelector("#cookie")
    const sendButton = acceptFriendRequest.querySelector("#send")
    const clearButton = acceptFriendRequest.querySelector("#clear")
    const request = acceptFriendRequest.querySelector("#request")
    const response = acceptFriendRequest.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const sender = parseInt(senderInp.value)
        const id = parseInt(idInp.value)
        const cookie = cookieInp.value
        
        const req = JSON.stringify({sender: sender, id: id, cookie: cookie})

        const res = await (await fetch("/api/acceptFriendRequest", {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: req
        })).json()

        request.textContent = req
        response.textContent = JSON.stringify(res)
    })

    clearButton.addEventListener("click", () => {
        request.textContent = ""
        response.textContent = ""
    })
}

// DECLINE FRIEND REQUEST
{
    const declineFriendRequest = document.getElementById("decline-friend-request")
    const senderInp = declineFriendRequest.querySelector("#sender")
    const idInp = declineFriendRequest.querySelector("#id")
    const cookieInp = declineFriendRequest.querySelector("#cookie")
    const sendButton = declineFriendRequest.querySelector("#send")
    const clearButton = declineFriendRequest.querySelector("#clear")
    const request = declineFriendRequest.querySelector("#request")
    const response = declineFriendRequest.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const sender = parseInt(senderInp.value)
        const id = parseInt(idInp.value)
        const cookie = cookieInp.value
        
        const req = JSON.stringify({sender: sender, id: id, cookie: cookie})

        const res = await (await fetch("/api/declineFriendRequest", {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: req
        })).json()

        request.textContent = req
        response.textContent = JSON.stringify(res)
    })

    clearButton.addEventListener("click", () => {
        request.textContent = ""
        response.textContent = ""
    })
}