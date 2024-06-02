//Global variables
let currentLocation = "index";
let currentDiscount = 0;
let categories;
let products;
const mainPage = document.getElementById("main-page");
const searchBar = document.getElementById("searchBar");
const searchBarResults = document.getElementById("searchBarResults");

//Create searchbar behavior
searchBar.addEventListener("keyup", (e) => {
  searchBarQuery(e);
});
searchBar.addEventListener("submit", (e) => {
  e.preventDefault();
  currentLocation = "search";
  handleLocation();
});


function getCategories() { //Gets the categories from the server
  fetch("http://127.0.0.1:8000/categories")
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      }
    })
    .then((data) => {
      categories = data;
      handleLocation();
    });
}
getCategories();

function searchBarQuery(e) { //Handles the query and results on the search bar
  e.preventDefault();
  const query = e.target.value;
  if (query.length == 0) {
    searchBarResults.innerHTML = "";
    return;
  }
  console.log("attempting query :" + query);
  fetch(`http://127.0.0.1:8000/search?q=${encodeURIComponent(query)}`)
    .then((response) => {
      searchBarResults.innerHTML = "";
      return response.json();
    })
    .then((data) => {
      if (data.length == 0) {
        searchBarResults.innerHTML += `<p class="list-group-item">No results found &#128542</p>`;
      }
      for (let i = 0; i < 5; i++) {
        if (!data[i]) {}
        else if (Object.keys(data[i]).length == 2) {
            searchBarResults.innerHTML += `<button class="z-3 list-group-item list-group-item-action" id="qCat-${data[i].id}">${data[i].name} <small class="fw-light text-secondary">Category</small></button>`;
            let categoryQueryButton = document.getElementById(`qCat-${data[i].id}`);
            categoryQueryButton.addEventListener("click", () => {(currentLocation = "cat" + data[i].id), handleLocation();})
        } else if (data[i]) {
          searchBarResults.innerHTML += `<button class="z-3 list-group-item list-group-item-action" id="qProdCat-${data[i].category}">${data[i].name} <small class="fw-light">$${data[i].price}</small></button>`;
          let productQueryButton = document.getElementById(`qProdCat-${data[i].category}`);
          productQueryButton.addEventListener("click", () => {(currentLocation = "cat" + data[i].category), handleLocation();})
        }
      }
      console.log(data);
    });
}

function handleDiscount(discount) { //Handles the behavior of the discount buttons
  currentDiscount = discount != currentDiscount ? discount : 0;
  showFilteredProducts();
  const buttonDiscount5percent = document.getElementById("5percentOffButton");
  const buttonDiscount10percent = document.getElementById("10percentOffButton");
  const buttonDiscount15percent = document.getElementById("15percentOffButton");
  const buttonDiscount20percent = document.getElementById("20percentOffButton");
  if (currentDiscount == 0) {
    buttonDiscount5percent.classList.add("btn-primary");
    buttonDiscount5percent.classList.remove("btn-secondary");
    buttonDiscount10percent.classList.remove("btn-secondary");
    buttonDiscount10percent.classList.add("btn-primary");
    buttonDiscount15percent.classList.remove("btn-secondary");
    buttonDiscount15percent.classList.add("btn-primary");
    buttonDiscount20percent.classList.remove("btn-secondary");
    buttonDiscount20percent.classList.add("btn-primary");
  } else if (currentDiscount == 5) {
    buttonDiscount5percent.classList.add("btn-primary");
    buttonDiscount5percent.classList.remove("btn-secondary");
    buttonDiscount10percent.classList.remove("btn-primary");
    buttonDiscount10percent.classList.add("btn-secondary");
    buttonDiscount15percent.classList.remove("btn-primary");
    buttonDiscount15percent.classList.add("btn-secondary");
    buttonDiscount20percent.classList.remove("btn-primary");
    buttonDiscount20percent.classList.add("btn-secondary");
  } else if (currentDiscount == 10) {
    buttonDiscount5percent.classList.remove("btn-primary");
    buttonDiscount5percent.classList.add("btn-secondary");
    buttonDiscount10percent.classList.add("btn-primary");
    buttonDiscount10percent.classList.remove("btn-secondary");
    buttonDiscount15percent.classList.remove("btn-primary");
    buttonDiscount15percent.classList.add("btn-secondary");
    buttonDiscount20percent.classList.remove("btn-primary");
    buttonDiscount20percent.classList.add("btn-secondary");
  } else if (currentDiscount == 15) {
    buttonDiscount5percent.classList.remove("btn-primary");
    buttonDiscount5percent.classList.add("btn-secondary");
    buttonDiscount10percent.classList.remove("btn-primary");
    buttonDiscount10percent.classList.add("btn-secondary");
    buttonDiscount15percent.classList.add("btn-primary");
    buttonDiscount15percent.classList.remove("btn-secondary");
    buttonDiscount20percent.classList.remove("btn-primary");
    buttonDiscount20percent.classList.add("btn-secondary");
  } else if (currentDiscount == 20) {
    buttonDiscount5percent.classList.remove("btn-primary");
    buttonDiscount5percent.classList.add("btn-secondary");
    buttonDiscount10percent.classList.remove("btn-primary");
    buttonDiscount10percent.classList.add("btn-secondary");
    buttonDiscount15percent.classList.remove("btn-primary");
    buttonDiscount15percent.classList.add("btn-secondary");
    buttonDiscount20percent.classList.add("btn-primary");
    buttonDiscount20percent.classList.remove("btn-secondary");
  }
}

const indexPage = async () => { //Creates the index page
  const htmlContent = `<div class="container py-2">
  <div class="row">
    <p class="fs-5 fw-light">
        Welcome! Here are the categories of products we have available for you.
    </p>
  </div>
  <div class="row g-2" id="categoryContainer"></div>`;
  mainPage.innerHTML = htmlContent;
  const categoryContainer = document.getElementById("categoryContainer");
  console.log(categories);
  for (let category of categories) {
    categoryContainer.innerHTML += `
        <div class="btn btn-primary fs-5 col-md-5 col-sm-12 mx-1" id="category-${category.id}">${category.name}</div>`;
  }
  for (let category of categories) {
    let button = document.getElementById(`category-${category.id}`);
    button.addEventListener("click", () => {
      (currentLocation = "cat" + category.id), handleLocation();
    });
  }
};

const categoryPage = async (category) => { //Creates the category page with the fetched products and the discount buttons
  console.log("changed to " + category);
  currentLocation = "cat" + category;
  const htmlContent = `<div class="container py-2">
    
    <button class="fs-5 btn btn-primary px-4 my-2 mx-0" id="backToHomeButton">Back to categories</button>
    <div class="ms-1 row d-flex justify-content-between mb-4 flex-wrap">
      <button class="col fs-6 fw-light py-0 px-1 btn my-1 btn-primary mx-1" id="5percentOffButton"><small>5% or more off</small></button>
      <button class="col fs-6 fw-light py-0 px-1 btn my-1 btn-primary mx-1" id="10percentOffButton"><small>10% or more off</small></button>
      <button class="col fs-6 fw-light py-0 px-1 btn my-1 btn-primary mx-1" id="15percentOffButton"><small>15% or more off</small></button>
      <button class="col fs-6 fw-light py-0 px-1 my-1 btn btn-primary mx-1" id="20percentOffButton"><small>20% off</small></button>
  </div>
    <div class="row">
        <h3>${categories[category - 1].name}</h3>
    </div>
    <div class="row g-3 row-cols-2 row-cols-md-3 row-cols-lg-4" id="productContainer"></div>
    </div>
    </div>`;

  mainPage.innerHTML = htmlContent;
  const backToHomeButton = document.getElementById("backToHomeButton");
  backToHomeButton.addEventListener("click", () => {
    (currentDiscount = 0), (currentLocation = "index"), handleLocation();
  });

  const buttonDiscount5percent = document.getElementById("5percentOffButton");
  const buttonDiscount10percent = document.getElementById("10percentOffButton");
  const buttonDiscount15percent = document.getElementById("15percentOffButton");
  const buttonDiscount20percent = document.getElementById("20percentOffButton");
  buttonDiscount5percent.addEventListener("click", () => {
    console.log("5");
    handleDiscount(5);
  });
  buttonDiscount10percent.addEventListener("click", () => {
    console.log("10");
    handleDiscount(10);
  });
  buttonDiscount15percent.addEventListener("click", () => {
    console.log("15");
    handleDiscount(15);
  });
  buttonDiscount20percent.addEventListener("click", () => {
    console.log("20");
    handleDiscount(20);
  });

  products = await fetch(`http://127.0.0.1:8000/products/${category}`)
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      }
    })
    .then((data) => {
      return data;
    });
  showFilteredProducts();
};

function showFilteredProducts() { //Shows the products after filtering, default on 0 discount
  const productContainer = document.getElementById("productContainer");
  productContainer.innerHTML = "";
  for (let product of products) {
    if (product.discount >= currentDiscount) {
      let discount =
        product.discount != 0
          ? "Exclusive offer! Enjoy your " +
            product.discount +
            "% off! until February 29th!"
          : "";
      productContainer.innerHTML += `
    <div class="card px-0">
      <img src=${product.url_image} class="card-img-top img-fluid" style="height: 75%, width: 75%">
      <div class="card-body">
        <h5 class="card-title">${product.name}</h5> 
        <p class="card-text">${discount}</p>
      </div>
      <div class="card-footer d-flex align-items-center">
        <p class="fs-6 fw-semibold text-body-light">Get it for $${product.price}</p>
      </div>
    </div>`;
    }
  }
}

const handleLocation = async () => { //Calls the appropriate page after a click on a link
  searchBarResults.innerHTML = "";
  searchBar.value = "";
  console.log("trying to go to "+currentLocation);
  if (currentLocation === "index") {
    indexPage();
  } else if (currentLocation.includes("cat")) {
    categoryPage(currentLocation.split("cat")[1]);
  } else if (currentLocation === "search") {
    searchPage();
  }
};
