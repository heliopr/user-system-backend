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

// CHANGE EMAIL
{
    const changeEmail = document.getElementById("change-email")
    const newEmailInp = changeEmail.querySelector("#newEmail")
    const idInp = changeEmail.querySelector("#id")
    const cookieInp = changeEmail.querySelector("#cookie")
    const sendButton = changeEmail.querySelector("#send")
    const clearButton = changeEmail.querySelector("#clear")
    const request = changeEmail.querySelector("#request")
    const response = changeEmail.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const req = JSON.stringify({
            newEmail: newEmailInp.value,
            cookie: cookieInp.value,
            id: parseInt(idInp.value)
        })

        const res = await (await fetch("/api/changeEmail", {
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

// CONFIRM EMAIL
{
    const confirmEmail = document.getElementById("confirm-email")
    const emailInp = confirmEmail.querySelector("#email")
    const codeInp = confirmEmail.querySelector("#code")
    const sendButton = confirmEmail.querySelector("#send")
    const clearButton = confirmEmail.querySelector("#clear")
    const request = confirmEmail.querySelector("#request")
    const response = confirmEmail.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const req = JSON.stringify({
            email: emailInp.value,
            code: codeInp.value
        })

        const res = await (await fetch("/api/confirmEmail", {
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

// CHANGE DESCRIPTION
{
    const changeDescription = document.getElementById("change-description")
    const newDescriptionInp = changeDescription.querySelector("#newDescription")
    const idInp = changeDescription.querySelector("#id")
    const cookieInp = changeDescription.querySelector("#cookie")
    const sendButton = changeDescription.querySelector("#send")
    const clearButton = changeDescription.querySelector("#clear")
    const request = changeDescription.querySelector("#request")
    const response = changeDescription.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const req = JSON.stringify({
            newDescription: newDescriptionInp.value,
            cookie: cookieInp.value,
            id: parseInt(idInp.value)
        })

        const res = await (await fetch("/api/changeDescription", {
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

// REQUEST PASSWORD CHANGE
{
    const requestPasswordChange = document.getElementById("request-password-change")
    const newPasswordInp = requestPasswordChange.querySelector("#newPassword")
    const idInp = requestPasswordChange.querySelector("#id")
    const cookieInp = requestPasswordChange.querySelector("#cookie")
    const sendButton = requestPasswordChange.querySelector("#send")
    const clearButton = requestPasswordChange.querySelector("#clear")
    const request = requestPasswordChange.querySelector("#request")
    const response = requestPasswordChange.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const req = JSON.stringify({
            newPassword: newPasswordInp.value,
            cookie: cookieInp.value,
            id: parseInt(idInp.value)
        })

        const res = await (await fetch("/api/requestPasswordChange", {
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

// CONFIRM PASSWORD CHANGE
{
    const confirmPasswordChange = document.getElementById("request-password-change")
    const codeInp = confirmPasswordChange.querySelector("#code")
    const idInp = confirmPasswordChange.querySelector("#id")
    const cookieInp = confirmPasswordChange.querySelector("#cookie")
    const sendButton = confirmPasswordChange.querySelector("#send")
    const clearButton = confirmPasswordChange.querySelector("#clear")
    const request = confirmPasswordChange.querySelector("#request")
    const response = confirmPasswordChange.querySelector("#response")

    sendButton.addEventListener("click", async () => {
        const req = JSON.stringify({
            code: codeInp.value,
            cookie: cookieInp.value,
            id: parseInt(idInp.value)
        })

        const res = await (await fetch("/api/confirmPasswordChange", {
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