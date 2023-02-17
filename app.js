import {fetchMovieAvailability,fetchMovieList} from "./api.js"

const main = document.getElementsByTagName("main")[0];
const seatAvalibilityTitle = document.getElementsByTagName("h3")[0];
const booker = document.getElementById("booker");
const bookerHolder = document.getElementById("booker-grid-holder");
const bookSeatsBtn = document.getElementById("book-ticket-btn");

const moviesHolder = document.createElement("div");
moviesHolder.classList.add("movie-holder");

let  movies;

let loding = document.createElement("p");
loding.id = "loader";
loding.textContent = "Loading...";
main.appendChild(loding);

function createMovieTemplate(movieDetails){
    const movieName = movieDetails.name;
    const imageURL = movieDetails.imgUrl;

    const a = document.createElement("a");
    a.classList.add("movie-link");
    // a.href = "#";
    a.href = `/${movieName}`
    a.setAttribute("onclick", "showSeats(event)");

    const div = document.createElement("div");
    div.classList.add("moive");
    div.setAttribute("data-d", movieName);

    const imageDiv = document.createElement("div");
    imageDiv.classList.add("movie-img-wrapper");
    imageDiv.textContent = movieName;
    imageDiv.style.backgroundImage = `url(${imageURL})`;

    const title = document.createElement("h4");
    // title.name = "title";
    title.textContent = movieName;

    div.append(imageDiv, title);
    a.appendChild(div);
    moviesHolder.appendChild(a);
}

fetchMovieList()
.then((allMovies)=>{
    allMovies.forEach((eachMovie)=>{
        // console.log(eachMovie)
        createMovieTemplate(eachMovie);
    })
    main.innerHTML = "";
    main.appendChild(moviesHolder);
    // movies = document.getElementsByClassName("movie-link");

    // movies[0].addEventListener("click", ()=>{
    //     showSeats("21 Jump Street");
    // });
    // movies[1].addEventListener("click", ()=>{
    //     showSeats("22 Jump Street");
    // });
    // movies[2].addEventListener("click", ()=>{
    //     showSeats("Cars");
    // });
    // movies[3].addEventListener("click", ()=>{
    //     showSeats("Cars 2");
    // });
    // movies[4].addEventListener("click", ()=>{
    //     showSeats("Cars 3");
    // });
})

let numOfSelectedSeat = 0;
let seats;

window.showSeats = function(e){
    e.preventDefault();
    let movieName = e.target.textContent;
    bookerHolder.innerHTML = "";
    seats = new Set();
    numOfSelectedSeat = 0;
    bookSeatsBtn.classList.add("v-none");

    seatAvalibilityTitle.classList.remove("v-none");

    loding = document.createElement("p");
    loding.id = "loader";
    loding.textContent = "Loading...";
    bookerHolder.appendChild(loding);

        
    const bookingGridLeft = document.createElement("div");
    bookingGridLeft.classList.add("booking-grid");
    const bookingGridRight = document.createElement("div");
    bookingGridRight.classList.add("booking-grid");
    // console.log(movieName);
    fetchMovieAvailability(movieName)
    .then((seats)=>{
        loding.remove();
        bookerHolder.append(bookingGridLeft, bookingGridRight);

        for(let i=1; i<=24;i++){
            let div = document.createElement("div");
            div.id = `booking-grid-${i}`;
            div.textContent = i;

            if(seats.includes(i)){
                div.classList.add("unavailable-seat");
            }
            else{
                div.classList.add("available-seat");
                div.setAttribute("onclick", "availableSeatClicked(event)")
            }

            if(i<=12) bookingGridLeft.appendChild(div);
            else bookingGridRight.appendChild(div);
        }
    })
}


window.availableSeatClicked = function(e){
    let seatNum = e.target.textContent;
    if(e.target.classList.contains("selected-seat")){
        e.target.classList.remove("selected-seat");
        seats.delete(seatNum);
        numOfSelectedSeat--;
        if(numOfSelectedSeat == 0)
            bookSeatsBtn.classList.add("v-none");
        return;
    }
    e.target.classList.add("selected-seat");
    seats.add(seatNum);
    numOfSelectedSeat++;
    bookSeatsBtn.classList.remove("v-none");
}

bookSeatsBtn.addEventListener("click", ()=>{
    booker.innerHTML= "";

    const div = document.createElement("div");
    div.id = "confirm-purchase";
    const h3 = document.createElement("h3");
    h3.textContent = `Confirm your booking for seat numbers: ${Array.from(seats).join(", ")}`;

    const form = document.createElement("form");
    form.id = "customer-detail-form";
    form.setAttribute("onSubmit", "formSubmit(event)")

    const emailLable = document.createElement("label");
    emailLable.textContent = "Email: ";
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.name = "email";
    emailInput.required = true;
    emailLable.appendChild(emailInput);

    const phoneLable = document.createElement("label");
    phoneLable.textContent = "Phone Number: "
    const phoneInput = document.createElement("input");
    phoneInput.type = "tel";
    phoneInput.name = "phone";
    phoneInput.required = true;
    phoneLable.appendChild(phoneInput);
    
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Purchase";

    form.append(emailLable, phoneLable, submitBtn);

    div.appendChild(h3);
    div.appendChild(form);
    booker.appendChild(div);
})

window.formSubmit = function(e){
    e.preventDefault();
    // console.log("purchase clicked", e.target.phone.value);

    const div = document.createElement("div");
    div.id = "Success";

    const h3= document.createElement("h3");
    h3.textContent = "Booking details";
    
    const seatsP = document.createElement("p");
    seatsP.textContent = `Seats: ${Array.from(seats).join(',')}`;
    const phoneP = document.createElement("p");
    phoneP.textContent = `Phone number: ${e.target.phone.value}`;
    const emailP = document.createElement("p");
    emailP.textContent = `Email: ${e.target.email.value}`;

    div.append(h3, seatsP, phoneP, emailP);

    booker.innerHTML= "";
    booker.append(div);
}