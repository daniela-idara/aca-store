let state = {
  searchText:"",
  currentProductToAdd:null
}
let cart = [];
let addCartButton = null;
let txtEmail = null;
let txtPassword = null;
let btnSignUp = null;
let signup = null;
let home = null;
let mainDiv = null;

window.onload = function(){
  mainDiv = document.getElementById("product");
  signup = document.getElementById("signup");
  home = document.getElementById("wrapper");

  txtEmail = document.getElementById("email");
  txtPassword = document.getElementById("password");
  btnSignUp = document.getElementById("btnSignUp");
  btnSignUp.onclick = signUp;
  productList(products);
}

function productList(products){ 
  let cartDiv = document.getElementById("cart");
  let productsDiv = document.getElementById("products");
  let newProd = '';

   products.map(product =>{
        newProd +=`
      <div id = 'productCard'>
        <a onclick = 'moreInfo(${product.id})'><div><img src=${product.imgUrl}></div>
        <div><h4 id ='${product.id}'>${product.name}</h4></a></div>
        <div><h5 class="descript" id ='${product.id}'>${product.description}</h5></div>
        <div>${product.price}</div>
        <div>${product.rating + '&#9733; ' + 'rating'}</div>
        <div>${product.reviews.length + ' reviews'}</div><br>
        <div><button onclick = 'moreInfo(${product.id})' id = 'moreInfo'>More...</button></div>
        <div><button onclick = 'addToCart(${product.id})' id='cartButton${product.id}'>ADD TO CART</button></div>
        <div id = 'moreInfo${product.id}'></div>
    </div>
    `; 
  })
let sessionCartItems = sessionStorage.getItem("cart");
sessionCartItems ? (
    cartItems = JSON.parse(sessionCartItems),
    counter = 0,
    cartItems.map(prod => {
        counter =  counter + Number(prod.quantity);
    }),
    cartBtn.innerHTML = `<b>VIEW CART &#128722 ` + '(' + counter + ')</b>'
    ) : (
    cartItems = []
    );
if (productsDiv){
    productsDiv.innerHTML = newProd; 
}
}

function showHome(){
  state.currentProductToAdd = null;
  productList(products);
}

function searchFunc(){
  let searchText = document.getElementById("search").value;
  let filteredProducts = products.filter(prod => 
      prod.name.toLowerCase().includes(searchText) || prod.description.toLowerCase().includes(searchText));
      productList(filteredProducts)
}

function moreInfo(prodId){
    let moreInfoDiv = '';
    let viewProd = products.filter(prod =>prod.id === prodId)
    productList(viewProd);
    let infoBtn = document.getElementById('moreInfo');
    let productDiv = document.getElementById(`moreInfo${prodId}`);
    viewProd[0].reviews.map(review =>
        moreInfoDiv += `<br>
            <div class = 'review'>
            <div></div>
            <div>${review.description}</div>
            <div>${review.rating} &#9733; rating </div>
            </div>`
        )
    productDiv.innerHTML = moreInfoDiv;
    infoBtn.innerHTML = "Less...";
    infoBtn.addEventListener("click", function(){goBack()});
    totalPrice.innerHTML = "";
}

function addToCart(prodId){
  let foundProd = products.find(p => p.id === prodId);
  let foundInCart = cartItems.find(p => p.id === prodId);
  if (!foundInCart){
      cartItems.push(foundProd);
      cartItems.find(p => p.id === prodId).quantity = 1;
  }
  else{
      foundInCart.quantity += 1;
  }
  sessionStorage.setItem("cart", JSON.stringify(cartItems));
  productList(products);
}

function signUp(){
  let email = txtEmail.value;
  let password = txtPassword.value;
  home.style.display = "block";
  signup.style.display = "none";
}

function goBack(){
  productList(products);
}

function showCart(){
  productList(cartItems);
  cartDiv = document.getElementById("cart");
  let emptyCart =  `<div id = "empty">
    <div>Your cart is empty!<div>
    <div><button onClick="goBack()">Refresh</button></div>
    </div>`;
cartDiv = document.getElementById("products");
  if (cartItems.length === 0){
    cartDiv.innerHTML = emptyCart;
    document.getElementById('totalPrice').innerHTML = " ";
  } else {
    cartItems.map(product => {
      let cartButton = document.getElementById(`cartButton${product.id}`);
      let qty = product.quantity;
      let price = product.price;
      let numPrice = price.slice(1, [price.length]);
      let number = Number(numPrice);
      let itemTotal = (number * qty).toFixed(2) ;
  
      cartButton.setAttribute('onClick', `removeCartItem(${product.id});`);
      cartButton.innerHTML = "REMOVE ITEM"
      moreInfoDiv = document.getElementById(`moreInfo${product.id}`)
      moreInfoDiv.innerHTML = `<div>
          <select id = 'qty${product.id}' onchange='changeQuantity(${product.id}, value)'>
          <option value = '1'>1</option>
          <option value = '2'>2</option>
          <option value = '3'>3</option>
          <option value = '4'>4</option>
          <option value = '5'>5</option>
          <option value = '6'>6</option>
          <option value = '7'>7</option>
          <option value = '8'>8</option>
          <option value = '9'>9</option>
          <option value = '10'>10</option>
          </select></div>
          </div><br>
          <div id="totalInfo">TOTAL: ${price}  x  <span id="qty">${qty}</span>  = $<span id="eachTotal">${itemTotal}</span></div>`;
          
      document.getElementById(`qty${product.id}`).value = product.quantity;
      document.getElementById(`qty${product.id}`).options[product.quantity - 1].selected = true;
  });
  displayTotals();
}  
}

function changeQuantity(prodId, qty){
  let product = cartItems.find(p => p.id === prodId);
  product.quantity = Number(qty);
  sessionStorage.setItem("cart", JSON.stringify(cartItems));
  showCart();
}

//this function removes the item from the cart, updates the cart session, displays the cart
function removeCartItem(prodId){
  let removeProdIdx = cartItems.map(prod =>{return prod.id}).indexOf(prodId);
  cartItems.splice(removeProdIdx, 1);
  sessionStorage.setItem("cart", JSON.stringify(cartItems));
  showCart();
}

//this function displays the subtotal at the bottom of the cart page
function displayTotals(){
  let totalsInfos = document.querySelectorAll("#eachTotal");
  let totalArr = [];
  let displayTotal = 0;

  for (i = 0; i < cartItems.length; i++){
    totalArr.push(Number(totalsInfos[i].innerHTML));
  }
  let sum = totalArr.reduce((acc, val) => {
    return acc + val;
  });
  displayTotal = sum.toFixed(2);
  totalPrice.innerHTML = `
  <div id="#subTotal"> SUBTOTAL: $${displayTotal}</div> 
  <button>PROCEED TO CHECKOUT</button>
  `;
}