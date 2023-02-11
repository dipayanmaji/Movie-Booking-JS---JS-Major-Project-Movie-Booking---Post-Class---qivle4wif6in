import {fetchMovieAvailability,fetchMovieList} from "./api.js"

const main = document.getElementsByTagName("main")[0];
const seatAvalibilityTitle = document.getElementsByTagName("h3")[0];
const bookerHolder = document.getElementById("booker-grid-holder");

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
    a.href = "#";
    // a.href = `/${movieName}`
    // a.setAttribute("onclick", "showSeats()");

    const div = document.createElement("div");
    div.classList.add("moive");
    div.setAttribute("data-d", movieName);

    const imageDiv = document.createElement("div");
    imageDiv.classList.add("movie-img-wrapper");
    imageDiv.style.backgroundImage = `url(${imageURL})`;

    const title = document.createElement("h4");
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
    movies = document.getElementsByClassName("movie-link");

    movies[0].addEventListener("click", ()=>{
        showSeats("21 Jump Street");
    });
    movies[1].addEventListener("click", ()=>{
        showSeats("22 Jump Street");
    });
    movies[2].addEventListener("click", ()=>{
        showSeats("Cars");
    });
    movies[3].addEventListener("click", ()=>{
        showSeats("Cars 2");
    });
    movies[4].addEventListener("click", ()=>{
        showSeats("Cars 3");
    });
})



function showSeats(movieName){
    bookerHolder.innerHTML = "";

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
                div.setAttribute("onclick", "availableSeatClicked()")
            }

            if(i<=12) bookingGridLeft.appendChild(div);
            else bookingGridRight.appendChild(div);
        }
    })
}

function availableSeatClicked(){
    console.log("Available Seat Clicked");
}