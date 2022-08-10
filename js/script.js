let modeToggler = document.querySelector(".mode");
let modeIcon = document.getElementById("modeIcon");
let mode = "create";
let tmp;

modeToggler.addEventListener("click", (_) => {
  modeIcon.classList.toggle("fa-sun");
  document.body.classList.toggle("dark");
});

// Start CRUD functions ..

/* -- variables --*/
let title = document.getElementById("title");
let price = document.getElementById("price");
let texas = document.getElementById("texas");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let count = document.getElementById("count");
let total = document.getElementById("total");
let category = document.getElementById("category");
let search = document.getElementById("search");
let submit = document.getElementById("submit");

// get Total..

function getTotal() {
  if (price.value != 0) {
    let res =
      Number(price.value) +
      Number(ads.value) +
      Number(texas.value) -
      Number(discount.value);
    total.innerHTML = res;
    total.style.backgroundColor = "#040";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "#ec1839";
  }
}

// create product ..
let myProducts;
if (localStorage.dataArray != null) {
  myProducts = JSON.parse(localStorage.dataArray);
} else {
  myProducts = [];
}

submit.onclick = (_) => {
  if (
    (title.value == "" ||
      ads.value == "" ||
      texas.value == "" ||
      price.value == "" ||
      discount.value == "" ||
      count.value == "" ||
      category.value == "") &&
    mode == "create"
  ) {
    errorMessage.style.display = "block";
    return;
  }
  if (count.value > 100) {
    errorMessage.style.width = "360px";
    errorMessage.innerHTML =
      "Product count shouldn't be more than 100 <div class=close id=closeMessage>x</div>";
    errorMessage.style.display = "block";
    return;
  }

  let product = {
    title: title.value,
    price: price.value,
    texas: texas.value,
    ads: ads.value,
    discount: discount.value,
    category: category.value,
    total: total.innerHTML,
    count: count.value,
  };

  if (mode === "create") {
    if (product.count > 1) {
      for (let i = 0; i < product.count; i++) {
        myProducts.push(product);
      }
    } else {
      myProducts.push(product);
    }
  } else {
    if (
      (title.value == "" ||
        ads.value == "" ||
        texas.value == "" ||
        price.value == "" ||
        discount.value == "" ||
        category.value == "") &&
      mode == "update"
    ) {
      errorMessage.style.display = "block";
      return;
    }
    myProducts[tmp] = product;
    mode = "create";
    submit.innerHTML = "CREATE";
    submit.style.backgroundColor = "#ec1839";
    count.style.display = "inline";
  }

  localStorage.dataArray = JSON.stringify(myProducts);
  clear();
  showData();
  displayDeleteAllBtn();
  errorMessage.style.display = "none";
};

// clear input fields..

function clear() {
  title.value = "";
  ads.value = "";
  price.value = "";
  category.value = "";
  discount.value = "";
  texas.value = "";
  count.value = "";
  total.innerHTML = "";
}

// read data ...

function showData() {
  getTotal();
  let tbody = document.getElementById("tbody");
  let table = "";
  for (let i = 0; i < myProducts.length; i++) {
    table += `
    <tr>
      <td>${i}</td>
      <td>${myProducts[i].title}</td>
      <td>${myProducts[i].price}</td>
      <td>${myProducts[i].ads}</td>
      <td>${myProducts[i].discount}</td>
      <td>${myProducts[i].total}</td>
      <td>${myProducts[i].category}</td>
      <td><button onclick="updateItem(${i})">UPDATE</button></td>
      <td><button onclick="deleteProduct(${i})">DELETE</button></td>
    </tr>`;
  }
  tbody.innerHTML = table;
}
showData();

// delete product ..

function deleteProduct(id) {
  myProducts.splice(id, 1);
  localStorage.dataArray = JSON.stringify(myProducts);
  showData();
  displayDeleteAllBtn();
}

// delete all ..
let deleteBtn = document.getElementById("deletAll");

deleteBtn.addEventListener("click", (_) => {
  myProducts.splice(0);
  localStorage.clear();
  displayDeleteAllBtn();
  showData();
});
displayDeleteAllBtn();
function displayDeleteAllBtn() {
  if (myProducts.length == 0) {
    deleteBtn.style.display = "none";
  } else {
    deleteBtn.style.display = "inline";
  }
}

//error message ..

let errorMessage = document.getElementById("errorMessage");
let CloseErrorMessage = document.getElementById("closeMessage");

CloseErrorMessage.onclick = () => {
  errorMessage.style.display = "none";
};

// udate data ..

function updateItem(i) {
  title.value = myProducts[i].title;
  price.value = myProducts[i].price;
  ads.value = myProducts[i].ads;
  discount.value = myProducts[i].discount;
  category.value = myProducts[i].category;
  texas.value = 0;

  count.style.display = "none";
  getTotal();
  submit.innerHTML = "UPDATE";
  submit.style.backgroundColor = "rgb(13, 80, 13)";

  mode = "update";
  tmp = i;

  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// Search ...

let searchMode = "title";

function getSearchMode(id) {
  if (id == "searchByTitle") {
    searchMode = "title";
  } else {
    searchMode = "category";
  }
  search.placeholder = "Search by " + searchMode;

  search.focus();
  search.value = "";
  showData();
}

function searchData(searchItem) {
  let table = "";

  if (searchMode == "title") {
    for (let i = 0; i < myProducts.length; i++) {
      if (
        myProducts[i].title
          .toLowerCase()
          .includes(searchItem.toLowerCase().trim())
      ) {
        table += `
        <tr>
          <td>${i}</td>
          <td>${myProducts[i].title}</td>
          <td>${myProducts[i].price}</td>
          <td>${myProducts[i].ads}</td>
          <td>${myProducts[i].discount}</td>
          <td>${myProducts[i].total}</td>
          <td>${myProducts[i].category}</td>
          <td><button onclick="updateItem(${i})">UPDATE</button></td>
          <td><button onclick="deleteProduct(${i})">DELETE</button></td>
        </tr>`;
      }
    }
  } else {
    for (let i = 0; i < myProducts.length; i++) {
      if (
        myProducts[i].category
          .toLowerCase()
          .includes(searchItem.toLowerCase().trim())
      ) {
        table += `
        <tr>
          <td>${i}</td>
          <td>${myProducts[i].title}</td>
          <td>${myProducts[i].price}</td>
          <td>${myProducts[i].ads}</td>
          <td>${myProducts[i].discount}</td>
          <td>${myProducts[i].total}</td>
          <td>${myProducts[i].category}</td>
          <td><button onclick="updateItem(${i})">UPDATE</button></td>
          <td><button onclick="deleteProduct(${i})">DELETE</button></td>
        </tr>`;
      }
    }
  }
  tbody.innerHTML = table;
}
