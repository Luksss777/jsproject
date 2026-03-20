let section = document.querySelector("section");
let ul = document.querySelector("ul");

fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll")
  .then((pasuxi) => pasuxi.json())
  .then((data) => {
    console.log(data);
    data.forEach(
      (item) =>
        (ul.innerHTML += `<li onclick="changeCategory(${item.id})">${item.name}</li>`),
    );
  });

function showAll() {
  section.innerHTML = "";
  fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
    .then((pasuxi) => pasuxi.json())
    .then((data) => data.forEach((item) => (section.innerHTML += card(item))))
    .catch(() => (section.innerHTML = "<h1> Network Error </h1>"));
}

showAll();

function changeCategory(id) {
  section.innerHTML = "";
  fetch(`https://restaurant.stepprojects.ge/api/Categories/GetCategory/${id}`)
    .then((pasuxi) => pasuxi.json())
    .then((data) =>
      data.products.forEach((item) => (section.innerHTML += card(item))),
    );
}

function card(item) {
  const isAuthorized = Cookies.get("user");

  return `<div class="card">
            <img src="${item.image}" alt="">
            <h4>${item.name}</h4>
            <h6>${item.price}₾</h6>
            <h6 class="nuts">Nuts: ${item.nuts ? '<i class="fa-solid fa-check" style="color:green;"></i>' : '<i class="fa-solid fa-x" style="color: red;"></i>'}</h6>
            <h6>spiciness: ${item.spiciness}</h6>
            <h6>${item.vegeterian ? 'Vegetarian': 'Not Vegetarian'} </h6>
            <button 
                onclick="addToCart(${item.id}, ${item.price})" 
                ${!isAuthorized ? 'disabled style="opacity: 0.5; cursor: not-allowed; background: #ccc;"' : ''}>
                ${isAuthorized ? 'ADD TO CART' : 'LOG IN TO BUY'}
            </button>
        </div>`;
}

function addToCart(id, fasi) {
  const userToken = Cookies.get("user");

  if (!userToken) {
    alert("Please Login To Add Products");
    toggleModal('loginModal'); 
    return; 
  }

  let info = {
    quantity: 1,
    price: fasi,
    productId: id,
  };

  fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
    .then((pasuxi) => pasuxi.json())
    .then((data) => {
      let napovni = data.find((cartItem) => id == cartItem.product.id);

      if (napovni) {
        napovni.quantity++;
        fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
          method: "PUT",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: napovni.quantity,
            price: fasi,
            productId: id,
          }),
        })
          .then((pasuxi) => pasuxi.text())
          .then(() => alert("Product Added To Cart"));
      } else {
        fetch("https://restaurant.stepprojects.ge/api/Baskets/AddToBasket", {
          method: "POST",
          headers: {
            accept: "text/plain",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(info),
        })
          .then((pasuxi) => pasuxi.json())
          .then(() => alert("Product Added To Cart"));
      }
    });
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
    }
}


window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = "none";
    }
}

function login(e) {
    e.preventDefault();
    let formInfo = new FormData(e.target);
    let finalForm = Object.fromEntries(formInfo);

    fetch("https://api.everrest.educata.dev/auth/sign_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalForm)
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.access_token) {
            Cookies.set("user", data.access_token, { expires: 7 });
            alert("Authorization Is Successful");
            location.reload(); 
        } else {
            alert("EMail Or Password Is Incorrect!");
        }
    })
    .catch(() => alert("Unable to connect"));
}


function register(e) {
    e.preventDefault();
    let formInfo = new FormData(e.target);
    let finalForm = Object.fromEntries(formInfo);

    finalForm.age = Number(finalForm.age);
    finalForm.zipcode = Number(finalForm.zipcode);
    
    fetch("https://api.everrest.educata.dev/auth/sign_up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalForm)
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.errorKeys) {
            alert("Error: " + data.errorKeys[0]);
        } else {
            alert("Registration is successful");
            toggleModal('regModal');
            toggleModal('loginModal');
        }
    });
}

function checkAuth() {
    const userToken = Cookies.get("user");
    const authGroup = document.getElementById("authButtons");
    const profileBtn = document.getElementById("profileBtn");
    const navCartBtn = document.querySelector(".cart-btn");

    if (userToken) {
        if (authGroup) authGroup.style.display = "none";
        if (profileBtn) profileBtn.style.display = "block";
        if (navCartBtn) navCartBtn.style.display = "block";
    } else {
        if (authGroup) authGroup.style.display = "flex";
        if (profileBtn) profileBtn.style.display = "none";
        if (navCartBtn) navCartBtn.style.display = "none";
    }
}


function gotoProfile() {
    window.location.href = "profile.html";
}


showAll();
checkAuth();