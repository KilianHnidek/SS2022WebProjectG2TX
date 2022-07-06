const profilePicturesMap = new Map();

profilePicturesMap.set("No avatar", "/randomPictures/noAvatar.png");

profilePicturesMap.set("Beach", "/wheelchairs/background/BGbeach.png");
profilePicturesMap.set("Grass", "/wheelchairs/background/BGgrass.png");
profilePicturesMap.set("Mountain", "/wheelchairs/background/BGmountain.png");
profilePicturesMap.set("Snow", "/wheelchairs/background/BGsnow.png");
profilePicturesMap.set("Stone", "/wheelchairs/background/BGstone.png");

profilePicturesMap.set("iChair", "/wheelchairs/electric/iCHAIR_MC2.png");
profilePicturesMap.set("Meyra", "/wheelchairs/electric/MEYRA_1.611.png");
profilePicturesMap.set("Optimus", "/wheelchairs/electric/Optimus_2_S.png");
profilePicturesMap.set("Format", "/wheelchairs/manual/Format.png");
profilePicturesMap.set("Mo", "/wheelchairs/manual/MO_951B_60.png");
profilePicturesMap.set("CRI", "/wheelchairs/manual/CRI.png");
profilePicturesMap.set("Water Wheels", "/wheelchairs/manual/WaterWheels.png");

function generateAllUsersContainer() {

    let element = document.querySelector(".rightContainer");
    element ? element.remove() : null;

    fetch("/api/user/getAll")
        .then(res => res.json())
        .then(data => {

            const users = data.users;
            if (users) {

                new ElementCreator("div")
                    .with("class", "rightUsersContainer rightContainer")
                    .append(new ElementCreator("div")
                        .with("class", "adminContainer")
                    )
                    .append(new ElementCreator("div")
                        .with("class", "userContainer")
                    )
                    .appendTo(document.querySelector(".content")
                    )

                for (let i = 0; i < users.length; i++) {

                    let container, admin, user = "user";

                    container = document.querySelector(".userContainer");
                    admin = "User";

                    if (users[i].authorized) {
                        container = document.querySelector(".adminContainer");
                        admin = "Admin";
                    }

                    if (currentUser === users[i].username) user = "user currentUser";

                    new ElementCreator("div")
                        .with("class", `${user}`)
                        .append(new ElementCreator("img")
                            .with("src", `${profilePicturesMap.get(users[i].profilePicture)}`)
                        )
                        .append(new ElementCreator("ul")
                            .append(new ElementCreator("li")
                                .append(new ElementCreator("p")
                                    .text(`${users[i].username}`)
                                )
                                .append(new ElementCreator("p")
                                    .text(`${users[i].email}`)
                                )
                                .append(new ElementCreator("p")
                                    .text(`${admin}`)
                                )
                            )
                        )
                        .appendTo(container)
                }

            } else {
                return displayPopUpInfo("An error occurred while loading user profiles.");
            }
        })
}

function generateImgContainer() {

    let element = document.querySelector(".rightContainer");
    element ? element.remove() : null;

    const profileArray = Array.from(profilePicturesMap);

    new ElementCreator("div")
        .with("class", "rightImgContainer rightContainer")
        .append(new ElementCreator("div")
            .with("class", "currentImg")
            .append(new ElementCreator("img")
                .with("src", `${profilePicturesMap.get(profilePicture)}`)
                .with("alt", `${profilePicture}`)
            )
            .append(new ElementCreator("p")
                .text(`${profilePicture}`))
        )
        .append(new ElementCreator("div")
            .with("class", "terrainImgContainer")
            .append(new ElementCreator("h3")
                .text("Terrains")
            )
        )
        .append(new ElementCreator("div")
            .with("class", "wheelchairImgContainer")
            .append(new ElementCreator("h3")
                .text("Wheelchairs")
            )
        )
        .appendTo(document.querySelector(".content"))

    let terrainDiv = document.createElement("div");
    let wheelchairDiv = document.createElement("div");

    for (let i = 1; i < profileArray.length; i++) {

        let img = document.createElement("img");
        img.src = `${profileArray[i][1]}`;
        img.alt = `${profileArray[i][0]}`;

        if (!isAdmin && profileArray[i][0] === "CRI" || !isAdmin && profileArray[i][0] === "Water Wheels") {
            img.style.opacity = ".5";
            img.style.cursor = "not-allowed";

            img.addEventListener("click", () => {
                displayPopUpInfo("Only premium members can use this background image.");
            })
        } else {
            img.addEventListener("click", () => {
                changeProfilePicture(profileArray[i][0]).then();
            })
        }

        if (i <= 5) terrainDiv.append(img);
        else wheelchairDiv.append(img);
    }

    document.querySelector(".terrainImgContainer").append(terrainDiv);
    document.querySelector(".wheelchairImgContainer").append(wheelchairDiv);
}

function generateOneInputField(message) {

    fetch("/api/user/get")
        .then(res => res.json())
        .then(data => {

            if (data.user === null) return displayPopUpInfo("An error occurred while fetching user information.");

            let type, settingValue;
            if (message === "username") {
                type = "text";
                settingValue = data.user.username;
            } else {
                type = "email";
                settingValue = data.user.email;
            }

            let container = document.querySelector(".rightContainer");
            if (container !== null) container.remove();

            new ElementCreator("form")
                .with("class", "rightInputContainer rightContainer")
                .with("action", "javascript: if (message === 'username') {changeUsername(document.getElementById('input').value).then()} else {changeEmail(document.getElementById('input'').value).then();}"
                )
                .append(new ElementCreator("h2")
                    .with("class", "profileChangeHeading")
                    .text(`Change ${message}`)
                )
                .append(new ElementCreator("div")
                    .with("class", "userSettingValue")
                    .append(new ElementCreator("p")
                        .text(`Current ${message}:`)
                    )
                    .append(new ElementCreator("p")
                        .id("value")
                        .text(`${settingValue}`)
                    )
                )
                .append(new ElementCreator("div")
                    .with("class", "inputFields")
                    .append(new ElementCreator("p")
                        .text(`Enter a new ${message}:`)
                    )
                    .append(new ElementCreator("input")
                        .id("input")
                        .with("class", "inputField")
                        .with("type", `${type}`)
                        .with("placeholder", `${message}`)
                        .with("required")
                    )
                    .append(new ElementCreator("button")
                        .text("Save")
                        .listener("click", () => {

                            if (message === "username") {
                                changeUsername(document.getElementById("input").value).then();
                            } else {
                                changeEmail(document.getElementById("input").value).then();
                            }
                        })
                    )
                )
                .appendTo(document.querySelector(".content"))
        })
}

function generateChangePasswordField() {

    let element = document.querySelector(".rightContainer");
    element ? element.remove() : null;

    new ElementCreator("div")
        .with("class", "rightInputContainer rightContainer")
        .append(new ElementCreator("h2")
            .with("class", "profileChangeHeading")
            .text("Change password")
        )
        .append(new ElementCreator("div")
            .with("class", "inputFields")
            .append(new ElementCreator("p")
                .text("Enter your old password:")
            )
            .append(new ElementCreator("input")
                .id("inputOld")
                .with("class", "inputField")
                .with("type", "password")
                .with("placeholder", "old password")
                .with("required")
            )
            .append(new ElementCreator("p")
                .id("secondPar")
                .text("Enter your new password:")
            )
            .append(new ElementCreator("input")
                .id("inputNew")
                .with("class", "inputField")
                .with("type", "password")
                .with("placeholder", "new password")
                .with("required")
            )
            .append(new ElementCreator("button")
                .text("Save")
                .listener('click', () => {
                        let oldPassword = document.getElementById("inputOld").value;
                        let newPassword = document.getElementById("inputNew").value;
                        changePassword(oldPassword, newPassword).then();
                    }
                )
            )
        )
        .appendTo(document.querySelector(".content")
        )
}

function generateDeleteAccountField() {

    let element = document.querySelector(".rightContainer");
    element ? element.remove() : null;

    new ElementCreator("div")
        .with("class", "rightInputContainer rightContainer")
        .append(new ElementCreator("h2")
            .id("deleteHeading")
            .with("class", "profileChangeHeading")
            .text("Delete account")
        )
        .append(new ElementCreator("div")
            .with("class", "deleteItemsContainer")
            .append(new ElementCreator("p")
                .text("Once you delete your account, there is no going back. Please be certain.")
            )
            .append(new ElementCreator("button")
                .text("Delete account")
                .listener('click', () => {
                        deleteAccount().then();
                    }
                )
            )
        )
        .appendTo(document.querySelector(".content")
        )
}

async function deleteAccount() {

    fetch('/api/user/delete', {
        method: 'delete',
        headers: {'Content-Type': 'application/json'}
    }).then(res => res.json())
        .then(data => {

            if (data.bo) {
                displayPopUpInfo("Successfully deleted your account. Redirecting to homepage..")

                setTimeout(() => {window.location.href = 'index.html';}, 1500)

            } else {
                displayPopUpInfo("An error occurred while deleting your account.");
            }
        })
}

async function changePassword(oldPassword, newPassword) {

    fetch('/api/user/verifyPassword', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            oldPassword: oldPassword
        })
    }).then(res => res.json())
        .then(data => {

            if (data.bo) {
                fetch('/api/user/changePassword', {
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        newPassword: newPassword
                    })
                }).then(res => res.json())
                    .then(data => {

                        if (data.bo) {
                            displayPopUpInfo("Successfully changed your password.");
                        } else {
                            displayPopUpInfo("An error occurred while changing your password.");
                        }
                    })
            } else if (data.bo === false) {
                displayPopUpInfo("Incorrect password.");
            } else {
                displayPopUpInfo("An error occurred while changing your password.");
            }
        })
}

async function changeUsername(newUsername) {

    if (newUsername !== currentUser) {

        fetch('/api/user/changeUsername', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                newUsername: newUsername
            })
        }).then(res => res.json())
            .then(data => {

                if (data.bo) {
                    currentUser = newUsername;
                    document.querySelector("#value").innerHTML = currentUser;
                    document.querySelector(".topContainer h3").textContent = currentUser;

                } else if (data.bo === false) {
                    displayPopUpInfo("This username is already taken.");

                } else {
                    displayPopUpInfo("An error occurred while changing your username.");
                }
            })
    } else {
        displayPopUpInfo("Enter a different username.");
    }
}

async function changeEmail(newEmail) {

    fetch('/api/user/changeEmail', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            newEmail: newEmail
        })
    }).then(res => res.json())
        .then(data => {

            if (data.bo) {
                document.querySelector("#value").innerHTML = newEmail;
                displayPopUpInfo("Successfully changed your email address.");

            } else if (data.bo === false) {
                displayPopUpInfo("Enter a different email address.");

            } else {
                displayPopUpInfo("An error occurred while changing your email.");
            }
        })
}

async function changeProfilePicture(pictureKey) {

    fetch("/api/user/changeProfilePicture", {
        method: "post",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            profilePicture: pictureKey
        })
    }).then(res => res.json())
        .then(data => {

            if (data.bo) {
                profilePicture = pictureKey;

                document.querySelector(".currentImg img").setAttribute("src", `${profilePicturesMap.get(profilePicture)}`);
                document.querySelector(".currentImg p").textContent = profilePicture;
                updateProfilePicture();

            } else {
                displayPopUpInfo("An error occurred while changing your profile picture.");
            }
        })
}

function updateProfilePicture() {

    let img = document.querySelector(".topContainer img");

    img.setAttribute("src", `${profilePicturesMap.get(profilePicture)}`);
    img.setAttribute("alt", `${profilePicture}`);
    img.addEventListener("click", () => changeProfilePicture(profilePicture));

    document.querySelector(".topContainer h3").textContent = currentUser;

}

document.addEventListener("DOMContentLoaded", function (event) {

    currentPage = document.location.pathname.replace("/", "").replace(".html", "");

    importNavBar();

});