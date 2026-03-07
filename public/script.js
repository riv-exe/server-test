//Client Side
const formOverlay = document.getElementById("form-overlay");
const userDataOverlay = document.getElementById("user-data-overlay");
const referralContainer = document.getElementById("referral-container");
const userList = document.querySelectorAll(".user");
const addPackageBtn = document.getElementById("addPackageBtn");
const confirmBtn = document.getElementById("confirmBtn");
const buyBtn = document.getElementById("buyBtn");
const body = document.body;

buyBtn.addEventListener("click", () => {
    formOverlay.style.display = "block";
});

formOverlay.addEventListener("click", (e) => {
    if (e.target === formOverlay) {
        formOverlay.style.display = "none";
    }
});

addPackageBtn.addEventListener("click", () => {
    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.name = "referrals[]";
    newInput.placeholder = "Enter referral name";
    
    referralContainer.appendChild(newInput);
});

confirmBtn.addEventListener("click", () => {
    if (document.getElementById("name").value !== "" && document.getElementById("package").value !== "")
    {
        buy();
        formOverlay.style.display = "none";
    }
});

userDataOverlay.addEventListener("click", (e) => {
    if (e.target === userDataOverlay) {
        userDataOverlay.style.display = "none";
    }
});

/////////////

function buy()
{
    const buy = 
    {
        username: document.getElementById("name").value,
        package: document.getElementById("package").value,
        
    }

    fetch("/buy", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(buy)
        })
    .then(res => res.json())
    .then(data => {
        console.log("Data Posted: ", data);
        tempId = data.id;
        addReferrals(tempId);
    });
}


function addReferrals(userId)
{
    const packageInputs = document.querySelectorAll('input[name="referrals[]"]');
    const userReferrals = Array.from(packageInputs).map(input => input.value);

    const referral = 
    {
        userID: userId,
        referrals: userReferrals
    }

    fetch("/buy/referral", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(referral)
        })
    .then(res => res.json())
    .then(data => {
        console.log("Data Posted: ", data);
    });
}







//Server SIde
const userContainer = document.getElementById("user-container");
const userData = document.getElementById("user-data");

getData();

function getData() 
{
    fetch("/userdata")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        userContainer.innerHTML = "";

        data.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.className = "user";
            userDiv.dataset.userid = user.id;

            userDiv.innerHTML = `
                <img src="/img/no-profile.png" alt="profile img">
                <div>
                    <p>Name: ${user.username}</p>
                    <p>Package: ${user.package}</p>
                </div>
            `;
            
            userDiv.addEventListener("click", () => {
                userDataOverlay.style.display = "block";
                const clickedId = userDiv.dataset.userid;
                console.log("Clicked user ID:", clickedId);

                getUserReferrals(clickedId);
            });

            userContainer.appendChild(userDiv);
        });
    })
}

function getUserReferrals(userId)
{
    fetch(`/userdata/referrals/${userId}`)
    .then(res => res.json())
    .then(data => {
        userData.innerHTML = "";

        data.forEach(referral => {
            const userDiv = document.createElement("div");
            userDiv.className = "user-refered-account"

            userDiv.innerHTML = `
                <button>${referral.refered_account}</button>
            `;

            userData.appendChild(userDiv);
        })
    })
}