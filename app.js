import axios from "axios"

const token = localStorage.getItem("todo-token")

document.querySelector("#registration_form").addEventListener("submit", (e) => {
  e.preventDefault()
  const email = document.querySelector("#email")
  const nickname = document.querySelector("#nickname")
  const password = document.querySelector("#password")

  if (email.value.trim() !== "" && password.value.trim() !== "") {
    const userData = {
      user: {
        email: email.value,
        nickname: nickname.value,
        password: password.value,
      },
    }
    axios
      .post("https://todoo.5xcamp.us/users", userData)
      .then(({ data }) => {
        //   const { data } = resp 解構
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
      })

    // fetch("https://todoo.5xcamp.us/users", {
    //   method: "POST",
    //   body: JSON.stringify(userData),
    //   headers: new Headers({
    //     "Content-type": "application/json",
    //   }),
    // })
    //   .then((resp) => {
    //     return resp.json()
    //   })
    //   .then((data) => {
    //     console.log(data)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
  }
})

document.querySelector("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const loginEmail = document.querySelector("#login_email")
  const loginPassword = document.querySelector("#login_password")

  if (loginEmail.value.trim() !== "" && loginPassword.value.trim() !== "") {
    const loginUserData = {
      user: {
        email: loginEmail.value,
        password: loginPassword.value,
      },
    }
    axios
      .post("https://todoo.5xcamp.us/users/sign_in", loginUserData)
      .then((resp) => {
        document.querySelector(".loginSuccess").textContent = resp.data.message
        const token = resp.headers.authorization
        // document.querySelector("#token").textContent = token
        localStorage.setItem("todo-token", token)
        console.log("登入成功")
      })
  }
})

document.querySelector("#checkform").addEventListener("submit", (e) => {
  e.preventDefault()
  const token = localStorage.getItem("todo-token")

  //   const token = document.querySelector("#token").value
  //   const token = localStorage.getItem("todo-token")
  if (token) {
    console.log(token)
    axios
      .get("https://todoo.5xcamp.us/check", {
        headers: {
          Authorization: token,
        },
      })
      .then(({ data }) => {
        document.querySelector("#result").textContent = data.message
      })
  }
})

document.querySelector("#logoutForm").addEventListener("submit", (e) => {
  e.preventDefault()
  // 1. 打 API
  // 2. 清 localStorage
  //   const token = localStorage.getItem("todo-token")
  axios
    .delete("https://todoo.5xcamp.us/users/sign_out", {
      headers: {
        Authorization: token,
      },
    })
    .then((resp) => {
      localStorage.setItem("todo-token", "")
      console.log("登出成功")
    })
    .catch((err) => {
      console.log(err)
    })
})

document.querySelector("#todoForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const todo = document.querySelector("#todo")
  //   const token = localStorage.getItem("todo-token")
  const todoData = {
    todo: {
      content: todo.value.trim(),
    },
  }
  axios
    .post("https://todoo.5xcamp.us/todos", todoData, {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => {
      const li = `<li data-id="${todo.id}"><span>X</span> ${data.content}</li>`
      document.querySelector("#todos").insertAdjacentHTML("afterbegin", li)
      e.target.reset()
    })
    .catch((err) => {
      console.log(err)
    })
})

if (token) {
  axios
    .get("https://todoo.5xcamp.us/todos", {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => {
      data.todos.forEach((todo) => {
        const ul = document.querySelector("#todos")
        const li = `<li data-id="${todo.id}"><span>X</span> ${todo.content}</li>`

        ul.insertAdjacentHTML("beforeend", li)
      })
      //   console.log(data)
    })
}

document.querySelector("#todoForm").addEventListener("click", (e) => {
  if (e.target.nodeName === "SPAN") {
    const li = e.target.parentElement
    const id = li.dataset.id
    // console.log(li.dataset.id)
    li.remove()

    axios.delete(`https://todoo.5xcamp.us/todos/${id}`, {
      headers: {
        Authorization: token,
      },
    })
  }
})
