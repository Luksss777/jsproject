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
    if (!res.ok) throw new Error("ავტორიზაცია ვერ მოხერხდა");
    return res.json();
})
.then(data => {
    userDataDiv.innerHTML = `
        <img class="profile-img" src="${data.avatar || 'https://via.placeholder.com/150'}" alt="Profile">
        <div class="profile-info">
            <h2>${data.firstName} ${data.lastName}</h2>
            <h4>${data.email}</h4>
            <p><strong>ტელეფონი:</strong> ${data.phone}</p>
            <p><strong>მისამართი:</strong> ${data.address || 'არ არის მითითებული'}</p>
        </div>
    `;
})
.catch(err => {
    console.error(err);
    userDataDiv.innerHTML = "<p>მონაცემების წამოღება ვერ მოხერხდა.</p>";
});

function logOut() {
    Cookies.remove("user");
    window.location.href = "index.html";
}