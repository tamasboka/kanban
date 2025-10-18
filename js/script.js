const TODO_DIV = document.querySelector("#cards_div")
const DONE_DIV = document.querySelector("#done_div")
const DOING_DIV = document.querySelector("#doing_div")
const TRASH = document.querySelector("#trashed")
const BODY = document.querySelector("body")
const DELALL_P = document.querySelector("#deleteAllTimer")

const deleteAllBtn = document.querySelector("#deleteAllBtn")
const darkmodeBtn = document.querySelector("#darkmodeBtn")
const newToDoInput = document.querySelector("#new_todoInput")
const newToDoDate = document.querySelector("#new_todoDate")
const newToDoColor = document.querySelector("#new_todoColor")
const newToDoSubmit = document.querySelector("#new_todoButton")
const moveAllIntoTodo = document.querySelector("#putAllIntoTodoBtn")
const moveAllIntoDoing = document.querySelector("#putAllIntoDoingBtn")
const moveAllIntoDone = document.querySelector("#putAllIntoDoneBtn")

// Array that contains all the cards
const allcards = []

let deleteAllHeldTimer;
let deleteAllHeldTimerShown;
let validateTimer;
let deleteHeldTimer;

document.addEventListener("DOMContentLoaded", () => renderColumns(allcards))

moveAllIntoDone.addEventListener("click", () => {
    putAllIntoDone()
})

moveAllIntoDoing.addEventListener("click", (e) => {
    putAllIntoDoing()
})

moveAllIntoTodo.addEventListener("click", (e) => {
    putAllIntoTodo()
})

darkmodeBtn.addEventListener("click", (e) => {
    toggleDarkMode(darkmodeBtn)
})

newToDoInput.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
        const data = getNewCardData()
        generateCard(data)
        newToDoInput.value = ""
    }
});

newToDoInput.addEventListener("keydown", (e) => {
    clearTimeout(validateTimer)
    validateTimer = setTimeout(() => {
        if (newToDoInput.value.length <= 3) {
            newToDoInput.classList.add("is-invalid")
        } else {
            newToDoInput.classList.remove("is-invalid")
        }
    }, 500)
})

newToDoSubmit.addEventListener("click", (e) => {
    e.preventDefault()
    const data = getNewCardData()
    generateCard(data)
    newToDoInput.value = ""
})

deleteAllBtn.addEventListener("mousedown", () => delAllBtnFunc());

/**
 * Delete all button's function.
 */
function delAllBtnFunc() {
    clearInterval(deleteAllHeldTimerShown)
    clearTimeout(deleteAllHeldTimer)
    let timer = 50
    DELALL_P.innerText = "Törlés megkezdése."
    deleteAllHeldTimer = setTimeout((e) => {
        allcards.splice(0, allcards.length)
        renderColumns(allcards)
    }, 5000)
    deleteAllHeldTimerShown = setInterval(() => {
        DELALL_P.innerText = timer
        timer--
        if (timer === 0) {
            cancelDelete()
        }
    }, 100)

    function cancelDelete() {
        clearTimeout(deleteAllHeldTimer)
        clearInterval(deleteAllHeldTimerShown)
        DELALL_P.innerText = ""
    }

    document.addEventListener("mouseup", cancelDelete)
}

/**
 * Runs the putCardIntoTodo with all cards
 */
function putAllIntoTodo() {
    for (const card of allcards) {
        putCardIntoTodo(card)
    }
}

function putAllIntoDoing() {
    for (const card of allcards) {
        putCardIntoDoing(card)
    }
}

function putAllIntoDone() {
    for (const card of allcards) {
        putCardIntoDone(card)
    }
}

/**
 * Generates a card based on given object. Object must contain keys date, text and color.
 * @param {object} data 
 */
function generateCard(data) {
    const div = document.createElement("div")
    div.id = "card-div"

    const card = document.createElement("div")
    card.classList.add("card")
    const cardBody = document.createElement("div")
    const cardText = document.createElement("h3")
    const cardFooter = document.createElement("div")
    const cardDueDate = "Határidő: " + data.date;
    const cardColor = data.color
    card.style.backgroundColor = cardColor
    cardText.innerHTML = data.text
    cardFooter.classList.add("card-footer")
    cardFooter.innerHTML = "Azonnali törlés: DEL"
    cardBody.classList.add("card-body")
    cardText.classList.add("card-text")
    cardBody.append(cardText)
    cardBody.append(cardDueDate)
    card.append(cardBody, cardFooter)

    const buttons = generateButtons(div)
    const buttonsDiv = document.createElement("div")
    buttonsDiv.id = "buttons_div"
    buttonsDiv.append(buttons.moveBtn, buttons.starBtn, buttons.deleteBtn)

    div.append(card, buttonsDiv)

    div.setAttribute("tabindex", "0")
    div.dataset.status = "todo"
    div.addEventListener("click", () => handleButtonDelClick(div))

    allcards.push(div)
    renderColumns(allcards)
}

/**
 * Reads all data from the input fields and returns it as an object with keys text, date and color.
 * @returns object
 */
function getNewCardData() {
    return {
            "text": newToDoInput.value,
            "date": newToDoDate.value,
            "color": newToDoColor.value
        }
}

/**
 * A card gains focus
 * @param {HTMLElement} card 
 */
function cardGetFocus(card) {
    card.focus()
}

/**
 * Function that detects if the delete key is pressed. If pressed, the card will be trashed.
 * @param {HTMLElement} card 
 */
function cardDetectDelBtn(card) {
    card.addEventListener("keydown", (e) => {
        if (e.code === "Delete") {
            card.setAttribute("hidden", "hidden")
        }
    })
}
/**
 * Function that handles the focus and key press of a card.
 * @param {HTMLElement} card 
 */
function handleButtonDelClick(card) {
    cardGetFocus(card)
    cardDetectDelBtn(card)
}

/**
 * Generates and adds corresponding function to delete, star and move buttons.
 * @param {HTMLElement} card 
 * @returns 
 */
function generateButtons(card) {
    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("btn", "btn-danger")
    deleteBtn.id = "deleteBtn"
    deleteBtn.innerText = "Törlés"
    deleteBtn.addEventListener("mousedown", () => delBtnFunc(deleteBtn, card));

    /*const moveBtn = document.createElement("button")
    moveBtn.classList.add("btn", "btn-primary")
    moveBtn.id = "moveBtn"
    moveBtn.innerText = "Áthelyezés"
    moveBtn.addEventListener("click", () => moveBtnFunc(card))*/
    const moveBtn = generateMoveBtn(card)

    const starBtn = document.createElement("button")
    starBtn.classList.add("btn", "btn-warning")
    starBtn.innerText = "Csillag"
    starBtn.addEventListener("click", () => toggleFavourite(card))

    return {
        "deleteBtn" : deleteBtn,
        "moveBtn": moveBtn,
        "starBtn" : starBtn
    }
}

/**
 * The function that will be set to the delete button of a card. 
 * @param {HTMLElement} deleteBtn The delete button
 * @param {HTMLElement} card Card that the button will interact with
 */
function delBtnFunc(deleteBtn, card) {
    deleteBtn.classList.remove("btn-danger")
    let rednessLevel = 255;
    let rednessTimer = setInterval(() => {
        deleteBtn.style.backgroundColor = "rgb(" + rednessLevel + ",0,0)"
        rednessLevel-=2
    }, 1)
    clearTimeout(deleteHeldTimer)
    deleteHeldTimer = setTimeout((e) => {
        putCardIntoTrash(card)
    }, 800)
    function cancelDelete() {
        clearInterval(rednessTimer)
        deleteBtn.classList.add("btn-danger")
        clearTimeout(deleteHeldTimer)
        deleteBtn.classList.add("btn-warn")
        deleteBtn.removeAttribute("style")
    }

    document.addEventListener("mouseup", cancelDelete)
}

function generateMoveBtn(card) {
    const div = document.createElement("div")
    div.classList.add("dropdown")
    const a = document.createElement("a")
    a.classList.add("btn", "btn-primary", "dropdown-toggle")
    a.dataset.bsToggle = "dropdown"
    a.innerText = "Áthelyezés"
    const ul = document.createElement("ul")
    ul.classList.add("dropdown-menu")
    for (const status of ["todo", "doing", "done"]) {
        const li = document.createElement("li")
        const button = document.createElement("button")
        button.classList.add("dropdown-item")
        if (status === "todo") {
            button.innerText = "Teendő"
            button.addEventListener("click", () => {
                putCardIntoTodo(card)
            })
        } else if (status === "doing") {
            button.innerText = "Folyamatban"
            button.addEventListener("click", () => {
                putCardIntoDoing(card)
            })
        } else {
            button.innerText = "Kész"
            button.addEventListener("click", () => {
                putCardIntoDone(card)
            })
        }
        li.append(button)
        ul.append(li)
    }
    div.append(a, ul)
    return div
}

/**
 * The function of the move button. Toggles a card's done state.
 * @param {HTMLElement} card 
 */
function moveBtnFunc(card) {
    
}

/**
 * Toggles a yellow border around a card
 * @param {HTMLElement} card Card that the border will be handled on
 */
function toggleFavourite(card) {
    if (card.classList.contains("border-warning")) {
        card.classList.remove("border", "border-warning", "border-5", "rounded")
    } else {
        card.classList.add("border", "border-warning", "border-5", "rounded")
    }
}

/**
 * Adds "trashed" class from card and runs renderColumns() function with all cards.
 * @param {HTMLElement} card 
 */
function putCardIntoTrash(card) {
    hideButtons(card)
    card.dataset.status = "trashed"
    card.classList.remove("border", "rounded", "border-5", "border-warning", "border-success")
    card.classList.add("border-danger", "rounded", "border-5", "border")
    handleTrashing(card)
    renderColumns(allcards)
}

function putCardIntoDoing(card) {
    card.dataset.status = "doing"
    card.classList.remove("border", "rounded", "border-5", "border-warning", "border-danger")
    renderColumns(allcards)
}

/**
 * Removes "trashed" class from card and runs renderColumns() function with all cards.
 * @param {HTMLElement} card 
 */
function putCardIntoTodo(card) {
    card.dataset.status = "todo"
    card.classList.remove("border", "rounded", "border-5", "border-warning", "border-danger")
    resetButtons(card)
    renderColumns(allcards)
}

/**
 * Handles trashing of a card. Adds a loading progress bar and cancel deletion buttons.
 * @param {HTMLElement} card 
 */
function handleTrashing(card) {
    const progress = createProgressBar(card)
    createCancelDeletionButton(card, progress)
}

/**
 * Sets a timer for the progress bar and increases its width based on time passed.
 * @param {HTMLElement} progressBar 
 */
function setProgressbarTimer(card, progressBar) {
    let progression = 0
    let progress;
    progress = setInterval(() => {
        progressBar.style.width = progression + "%"
        progression++
        if (progression === 100) {
            clearInterval(progress)
            card.setAttribute("hidden", "hidden")
        }
    }, 50)
    return progress
}

/**
 * Places a working cancel deéetion button into the card.
 * @param {HTMLElement} card Card
 * @param {} progress interval variable
 */
function createCancelDeletionButton(card, progress) {
    let cancelDeletion = document.createElement("button")
    cancelDeletion.classList.add("btn", "btn-warning")
    cancelDeletion.innerText = "Visszaállítás"
    cancelDeletion.id = "cancelBtn"
    cancelDeletion.addEventListener("click", (e) => {
        clearInterval(progress)
        putCardIntoTodo(card)
        hideProgressBar(card)
        hideResetButton(card)
    })
    card.append(cancelDeletion)
}

/**
 * Generates a progress bar into card
 * @param {HTMLElement} card 
 */
function createProgressBar(card) {
    
    let progressBarDiv = document.createElement("div")
    let progressBar = document.createElement("div")
    progressBarDiv.classList.add("progress")
    progressBar.classList.add("progress-bar", "progress-bar-striped", "w-0")
    progressBarDiv.append(progressBar)
    card.append(progressBarDiv)
    return setProgressbarTimer(card, progressBar)
    
}

/**
 * Add the hidden = hidden attribute to a node that has ID set to "buttons" from the card
 * @param {HTMLElement} card 
 */
function resetButtons(card) {
    card.querySelector("#buttons_div").removeAttribute("hidden")
}

/**
 * Add the hidden = hidden attribute to a node that has ID set to "buttons" from the card
 * @param {HTMLElement} card 
 */
function hideButtons(card) {
    console.log(card)
    card.querySelector("#buttons_div").setAttribute("hidden", "hidden")
}

/**
 * Adds hidden=hidden attribute to a card's element with the ID "cancelBtn"
 * @param {HTMLElement} card 
 */
function hideResetButton(card) {
    for (const el of card.childNodes) {
        if (el.id === "cancelBtn") {
            el.setAttribute("hidden", "hidden")
        }
    }
}

/**
 * Adds hidden=hidden attribute to a card's element with the ID "progress"
 * @param {HTMLElement} card 
 */
function hideProgressBar(card) {
    for (const el of card.childNodes) {
        if (el.classList.contains("progress")) {
            el.setAttribute("hidden", "hidden")
        }
    }
}

/**
 * Renders all cards from allcards into their corresponding column.
 * @param {Array} allcards Array of all cards
 */
function renderColumns(allcards) {
    TODO_DIV.innerHTML = "<div class='titlebar'><h1>Teendő</h1></div>"
    DOING_DIV.innerHTML = "<div class='titlebar'><h1>Folyamatban</h1></div>"
    DONE_DIV.innerHTML = "<div class='titlebar'><h1>Kész</h1></div>"
    TRASH.innerHTML = "<div class='titlebar'><h1>Kuka</h1></div>"
    for (const card of allcards) {
    console.log(card)
        if (card.dataset.status === "trashed") {
            TRASH.append(card)
        } else if (card.dataset.status === "done"){
            DONE_DIV.append(card)
        } else if (card.dataset.status === "todo"){
            TODO_DIV.append(card)
        } else if (card.dataset.status === "doing") {
            DOING_DIV.append(card)
        }
    }
}

/**
 * Toggles a card's as done status. When marked as done, adds the done class to the card and changes the border to green. If the card is already done, the done class gets removed.
 * @param {HTMLElement} card 
 */
function putCardIntoDone(card) {
    card.dataset.status = "done"
    //card.classList.remove("border", "border-success", "border-warning", "border-5", "rounded")
    //card.classList.add("border", "border-success")
    renderColumns(allcards)
}

//a sajat funkcio 2
/**
 * Function that toggles theme.
 */
function toggleDarkMode(btn) {
    console.log(btn)
    toggleDarkModeBtnLooks(btn)
    // to light
    if (btn.classList.contains("dark")) {
        BODY.classList.replace("lightmode", "darkmode")
    } else {
        //to dark
        BODY.classList.replace("darkmode", "lightmode")
    }
}

/**
 * Checks if the given HTML element contains the class value "light".
 * If it does, classes btn-light and light get swapped to btn-dark and dark.
 * @param {HTMLElement} btn 
 */
function toggleDarkModeBtnLooks(btn) {
    if (btn.classList.contains("light")) {
        btn.classList.replace("btn-light", "btn-dark")
        btn.classList.replace("light", "dark")
    } else {
        btn.classList.replace("btn-dark", "btn-light")
        btn.classList.replace("dark", "light")
    }
}