const products=[
{id:1,name:"Nova",category:"wiszace",type:"pendant",price:449,old:499,badge:"Bestseller",desc:"Minimalistyczna lampa wisząca"},
{id:2,name:"Line",category:"stojace",type:"floor",price:599,old:null,badge:"Nowość",desc:"Smukła lampa podłogowa"},
{id:3,name:"Halo",category:"kinkiety",type:"wall",price:289,old:null,badge:"Design",desc:"Kinkiet z miękkim światłem"},
{id:4,name:"Orb",category:"wiszace",type:"pendant",price:699,old:null,badge:"Premium",desc:"Oprawa wisząca nad stół"},
{id:5,name:"Luna",category:"stolowe",type:"table",price:239,old:279,badge:"Bestseller",desc:"Lampka stołowa do sypialni"},
{id:6,name:"Arc",category:"stojace",type:"floor",price:799,old:null,badge:"Nowość",desc:"Łukowa lampa do salonu"},
{id:7,name:"Beam",category:"kinkiety",type:"wall",price:349,old:null,badge:"",desc:"Kinkiet do przedpokoju"},
{id:8,name:"Muse",category:"stolowe",type:"table",price:319,old:null,badge:"Design",desc:"Dekoracyjna lampa stołowa"},
{id:9,name:"Cloud",category:"wiszace",type:"pendant",price:529,old:null,badge:"",desc:"Lekka forma do jadalni"},
{id:10,name:"Tall",category:"stojace",type:"floor",price:649,old:null,badge:"",desc:"Wysoka lampa do czytania"},
{id:11,name:"Dot",category:"kinkiety",type:"wall",price:259,old:null,badge:"",desc:"Kompaktowy kinkiet"},
{id:12,name:"Soft",category:"stolowe",type:"table",price:289,old:null,badge:"",desc:"Ciepłe światło na biurko"}
];
let cart=JSON.parse(localStorage.getItem("dideCart")||"[]");
const money=n=>new Intl.NumberFormat("pl-PL",{style:"currency",currency:"PLN",maximumFractionDigits:0}).format(n);
const $=s=>document.querySelector(s);

function renderProducts(){
 let list=[...products];
 const cat=$("#categoryFilter").value, price=$("#priceFilter").value, sort=$("#sort").value;
 if(cat!=="all") list=list.filter(p=>p.category===cat);
 if(price!=="all"){const [a,b]=price.split("-").map(Number);list=list.filter(p=>p.price>=a&&p.price<=b)}
 if(sort==="priceAsc")list.sort((a,b)=>a.price-b.price);
 if(sort==="priceDesc")list.sort((a,b)=>b.price-a.price);
 if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
 $("#products").innerHTML=list.map(p=>`
 <article class="product"><div class="visual v-${p.type}"><div class="shape"></div></div>
 <div class="product-body"><span class="badge">${p.badge||" "}</span><h3>${p.name}</h3><p>${p.desc}</p>
 <div class="price-row"><span class="price">${money(p.price)} ${p.old?`<del>${money(p.old)}</del>`:""}</span><button class="add" data-id="${p.id}">Dodaj</button></div></div></article>`).join("");
 document.querySelectorAll(".add").forEach(b=>b.onclick=()=>add(+b.dataset.id));
}
function add(id){const x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});save();toast("Dodano do koszyka");openCart()}
function save(){localStorage.setItem("dideCart",JSON.stringify(cart));renderCart()}
function total(){return cart.reduce((s,i)=>s+(products.find(p=>p.id===i.id)?.price||0)*i.qty,0)}
function renderCart(){
 $("#cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);
 $("#cartTotal").textContent=money(total());
 if(!cart.length){$("#cartItems").innerHTML='<div style="text-align:center;color:#888;padding:60px 10px">Twój koszyk jest pusty.</div>';return}
 $("#cartItems").innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-item"><div class="mini">◉</div><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${i.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div><button class="remove" onclick="removeItem(${p.id})">Usuń</button></div>`}).join("");
}
function changeQty(id,n){const x=cart.find(i=>i.id===id);x.qty+=n;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save()}
function removeItem(id){cart=cart.filter(i=>i.id!==id);save()}
function openCart(){ $("#cartDrawer").classList.add("open");$("#overlay").classList.add("show");renderCart()}
function closeCart(){ $("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("show")}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function openCheckout(){
 if(!cart.length){toast("Dodaj produkt do koszyka.");return}
 closeCart();$("#checkoutTotal").textContent=money(total()+(total()<500?15:0));$("#checkoutModal").classList.add("show");
}
document.querySelectorAll(".cat-grid button").forEach(b=>b.onclick=()=>{$("#categoryFilter").value=b.dataset.cat;renderProducts();document.querySelector("#sklep").scrollIntoView({behavior:"smooth"})});
["categoryFilter","priceFilter","sort"].forEach(id=>$("#"+id).onchange=renderProducts);
$("#openCart").onclick=openCart;$("#closeCart").onclick=closeCart;$("#overlay").onclick=closeCart;$("#checkoutBtn").onclick=openCheckout;
$("#closeCheckout").onclick=()=>$("#checkoutModal").classList.remove("show");
document.querySelectorAll(".pay").forEach(x=>x.onclick=()=>{document.querySelectorAll(".pay").forEach(y=>y.classList.remove("active"));x.classList.add("active")});
document.querySelectorAll('input[name="delivery"]').forEach(x=>x.onchange=()=>{$("#checkoutTotal").textContent=money(total()+(document.querySelector('input[name="delivery"]:checked').value==="courier"&&total()<500?15:0))});
$("#checkoutForm").onsubmit=e=>{e.preventDefault();$("#checkoutView").classList.add("hidden");$("#successView").classList.remove("hidden");$("#orderNo").textContent="DL-"+Math.floor(100000+Math.random()*900000);cart=[];save()};
$("#finish").onclick=()=>{$("#checkoutModal").classList.remove("show");$("#successView").classList.add("hidden");$("#checkoutView").classList.remove("hidden")};
$("#mobileMenu").onclick=()=>document.querySelector(".main-nav").style.display=document.querySelector(".main-nav").style.display==="flex"?"none":"flex";
renderProducts();renderCart();
