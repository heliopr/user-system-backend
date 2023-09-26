// REGISTER USER
{
    const registerUser = document.getElementById("register-user")
    const usernameInp = registerUser.querySelector("#username")
    const passInp = registerUser.querySelector("#password")
    const emailInp = registerUser.querySelector("#email")
    const sendButton = registerUser.querySelector("#send")
    const clearButton = registerUser.querySelector("#clear")
    const request = registerUser.querySelector("#request")
    const response = registerUser.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const req = {
            username: usernameInp.value,
            password: passInp.value,
            email: emailInp.value
        }

        const res = await (await fetch("/api/registerUser", {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify(req)
        })).json()

        request.textContent = JSON.stringify(req)
        response.textContent = JSON.stringify(res)
    })

    clearButton.addEventListener("click", () => {
        request.textContent = ""
        response.textContent = ""
    })
}

// GET USER
{
    const getUser = document.getElementById("get-user")
    const usernameInp = getUser.querySelector("#username")
    const idInp = getUser.querySelector("#id")
    const sendButton = getUser.querySelector("#send")
    const clearButton = getUser.querySelector("#clear")
    const request = getUser.querySelector("#request")
    const response = getUser.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const username = usernameInp.value
        const id = idInp.value
        let url = "/api/getUser/?"

        if (username != "") {
            url += "username="+username
        }
        else if (id != "") {
            url += "id="+id
        }


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

// GET COOKIE
{
    const getCookie = document.getElementById("get-cookie")
    const usernameInp = getCookie.querySelector("#username")
    const passInp = getCookie.querySelector("#password")
    const sendButton = getCookie.querySelector("#send")
    const clearButton = getCookie.querySelector("#clear")
    const request = getCookie.querySelector("#request")
    const response = getCookie.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const username = usernameInp.value
        const password = passInp.value
        let url = `/api/getCookie/?username=${username}&password=${password}`


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