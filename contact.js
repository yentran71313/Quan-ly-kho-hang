class Contact{
    constructor(id, nameId, avatar, nameSp, amount, number1){
        this.id = id;
        this.nameId = nameId;
        this.avatar = avatar;
        this.nameSp = nameSp;
        this.amount = amount;
        this.number1 = number1;
    }
}

const contact_key = "data-contact";
var contacts = [];
var page_size = 4;
var total_pages = 0;
var page_number = 1;
function init(){
    if(localStorage.getItem(contact_key) == null){
        contacts = [
            new Contact("1","SKU: 1810687", "https://ddhshop.vn/wp-content/uploads/2020/09/unnamed-1-22.jpg","Main", "1235445"),
            new Contact(2,'SKU: 200400521', `${avatar_url}/2.jpg`, '0935123123', 'cuong@gmail.com'),
        ];

        localStorage.setItem(contact_key, JSON.stringify(contacts));
    }
    else{
        contacts = JSON.parse(localStorage.getItem(contact_key));
    }
}

function renderContact(){
    let data = contacts.slice((page_size * (page_number - 1)), (page_size * page_number));
    let htmls = data.map(function(contact, index){
        return `
            <tr>
                <td class="text-center">
                    ${contact.nameId}</td>
                <td class="text-center">
                    <img class="avatar-sm" src="${contact.avatar}" alt="">
                </td>
                <td class="text-center">
                    ${contact.nameSp}
                </td>
                <td class="text-center">
                    ${contact.amount}USD
                </td>
                <td class="text-center">
                    ${contact.number1}
                </td>
                <td class="text-center">
                    <i class="fa-solid fa-pencil" onclick="getContact(${contact.id})"></i>
                    <i class="fa fa-trash" onclick='removeContact(${index})'></i>
                </td>
            </tr>
        `
    });
    document.querySelector('.table>tbody').innerHTML = htmls.join("");
    buildPagination()
}


function openModal(){
    document.querySelector('.modal-container').classList.add('show');
}
function closeModal(){
    document.querySelector('.modal-container').classList.remove('show');
    resetModal();
}

function changeAvatar(){
    document.querySelector('.avatar-lg').src = document.querySelector('#avatar').value || 'images/noavatar.jpg';
}

function addContact(){
    let nameId = document.querySelector('#nameId').value;
    let avatar = document.querySelector('#avatar').value;
    let nameSp = document.querySelector('#nameSp').value;
    let amount = document.querySelector('#amount').value;
    let number1 = document.querySelector('#number1').value;
    let id = findMaxId() + 1;
    if(nameId == ""||avatar==""||nameSp==""||amount==""||number1==""){
        alert('Chưa nhập sản phẩm!');
        return;}

    let contact = new Contact(id, nameId, avatar, nameSp, amount, number1);
    contacts.push(contact);
    localStorage.setItem(contact_key, JSON.stringify(contacts));
    closeModal();
    renderContact();
}


function resetModal(){
    document.querySelector('#contactId').value = "0";
    document.querySelector('#avatar').value = "";
    document.querySelector('#nameId').value ="";
    document.querySelector('#nameSp').value ="";
    document.querySelector('#amount').value = "";
    document.querySelector('#number1').value = "";
    document.querySelector('.avatar-lg').src = "images/noavatar.jpg";

    document.querySelector('#btnUpdate').classList.add('d-none');
    document.querySelector('#btnAdd').classList.remove('d-none');

    document.querySelector('.modal-title').innerText = "Add Contact";
}
function findMaxId(){
    let max = 0;
    for(let contact of contacts){
        if(contact.id > max){
            max = contact.id;
        }
    }

    return max;
}


function removeContact(index){

    let confirm = window.confirm('Are you sure to remove this contact?');
    if(confirm){
        contacts.splice(index, 1);
        localStorage.setItem(contact_key, JSON.stringify(contacts));
        renderContact();
    }
}

function getContact(contactId){
    let contact = contacts.find(function(ct){
        return ct.id === contactId;
    })

    document.querySelector('#contactId').value = contact.id;
    document.querySelector('#nameSp').value = contact.nameSp;
    document.querySelector('#nameId').value = contact.nameId;
    document.querySelector('#avatar').value = contact.avatar;
    document.querySelector('#amount').value = contact.amount;
    document.querySelector('#number1').value = contact.number1;
    document.querySelector('.avatar-lg').src = contact.avatar;

    document.querySelector('#btnUpdate').classList.remove('d-none');
    document.querySelector('#btnAdd').classList.add('d-none');

    document.querySelector('.modal-title').innerText = "Update Contact";
    openModal();
}
function ascending(field) {
    contacts.sort(function (can_1, can_2) {
        // return can_1[field] - can_2[field];
        if (can_1[field] > can_2[field]) {
            return 1;
        }
        if (can_1[field] < can_2[field]) {
            return -1;
        }
        return 0;
    })
    renderContact();
}
function descending(field) {
    contacts.sort(function (can_1, can_2) {
        // return can_1[field] - can_2[field];
        if (can_2[field] > can_1[field]) {
            return 1;
        }
        if (can_2[field] < can_1[field]) {
            return -1;
        }
        return 0;
    })
    renderContact();
}
function updateContact(){
    let id = document.querySelector('#contactId').value;

    let contact = contacts.find(function(ct){
        return ct.id == id;
    })
    
    contact.avatar = document.querySelector('#avatar').value;
    contact.nameSp = document.querySelector('#nameSp').value;
    contact.nameId = document.querySelector('#nameId').value;
    contact.amount = document.querySelector('#amount').value;
    contact.number1 = document.querySelector('#number1').value;
    
    localStorage.setItem(contact_key, JSON.stringify(contacts));

    closeModal();
    renderContact();
}
function buildPagination() {
    total_pages = Math.ceil(contacts.length / page_size);
    let paginationString = "";
    let start = page_number == 1 ? 1 : page_number == total_pages ? page_number - 2 : page_number - 1;
    let end = page_number == total_pages ? total_pages : page_number == 1 ? page_number + 2 : page_number + 1;
    paginationString += `<li class="page-item"><button onclick='changePage(1)'>&#x25C0;</button></li>`;
    for (let page = 1; page <= total_pages; page++) {
        paginationString += `<li class="page-item">
                                    <button class='${page == page_number ? 'active' : ''}'
                                        onclick='changePage(${page})'>
                                ${page}</button></li>`
    }
    paginationString += `<li class="page-item"><button onclick='changePage(${total_pages})'>&#x25B6;</button></li>`;
    document.getElementById('pagination').innerHTML = paginationString;
}
function changePage(page) {
    page_number = page;
    renderContact();
}

function main(){
    init();
    renderContact();
}

main();