const userDataDiv = document.getElementById("userData");
const token = Cookies.get("user");

if (!token) {
    window.location.href = "index.html";
}

fetch("https://api.everrest.educata.dev/auth", {
    method: "GET",
    headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
    }
})
.then(res => {
    if (!res.ok) throw new Error("Authorization Error");
    return res.json();
})
.then(data => {
    userDataDiv.innerHTML = `
        <img class="profile-img" src="${data.avatar || 'https://via.placeholder.com/150'}" alt="Profile">
        <div class="profile-info">
            <h2>${data.firstName} ${data.lastName}</h2>
            <h4>${data.email}</h4>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Adress:</strong> ${data.address || 'Is Not Specified'}</p>
        </div>
    `;
})
.catch(err => {
    console.error(err);
    userDataDiv.innerHTML = "<p>Failed To Retrieve Data</p>";
});

function logOut() {
    Cookies.remove("user");
    window.location.href = "index.html";
}