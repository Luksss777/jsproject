let ulKalataList = document.getElementById("kalataList");
let totalDisplay = document.getElementById("totalPriceDisplay");

function getAllCart() {
  fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
    .then((pasuxi) => pasuxi.json())
    .then((data) => {
      let totalSum = 0; 
      ulKalataList.innerHTML = ""; 

      data.forEach((item) => {
        ulKalataList.innerHTML += list(item);
        totalSum += item.quantity * item.price; 
      });

      totalDisplay.innerText = `Total: ${totalSum} ₾`;
    });
}

getAllCart();

function list(item) {
  return `<div class="cartt">
        
          <li>
              <img src="${item.product.image}" alt="">
              <h3>${item.product.name}</h3>
              <h3><button onclick="increase(${item.quantity}, ${item.product.id}, ${item.price})">+</button> ${item.quantity}  <button onclick="decrease(${item.quantity}, ${item.product.id}, ${item.price})">-</button> </h3>
              <h3> ${item.price} ₾ </h3>
              <h3> ${item.quantity * item.price} ₾ </h3>
              <button onclick="deleteItem(${item.product.id})">X</button>
          </li>
       </div>`
}

function increase(raodenoba, id, fasi) {
  raodenoba++;
  let info = {
    quantity: raodenoba,
    price: fasi,
    productId: id,
  };

  ulKalataList.innerHTML = "";
  fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
    method: "PUT",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  })
    .then((pasuxi) => pasuxi.text())
    .then(() => getAllCart());
}

function decrease(raodenoba, id, fasi) {
  if (raodenoba <= 1) return;
  raodenoba--;

  let info = {
    quantity: raodenoba,
    price: fasi,
    productId: id,
  };

  ulKalataList.innerHTML = "";

  fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
    method: "PUT",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  })
    .then((pasuxi) => pasuxi.text())
    .then(() => getAllCart());
}

function deleteItem(id) {
  ulKalataList.innerHTML = "";
  fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${id}`, {
    method: "DELETE",
    headers: { accept: "*/*" },
  })
    .then((pasuxi) => pasuxi.text())
    .then(() => getAllCart());
}
