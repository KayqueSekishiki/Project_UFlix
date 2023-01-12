const initialTheme = localStorage.getItem("theme");

const body = document.querySelector("body");
const movies = document.querySelector(".movies");
const modalGenres = document.querySelector(".modal__genres");
const input = document.querySelector(".input");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const btnTheme = document.querySelector(".btn-theme");

let currentPage = 1;
let moviesPerPage = 5;
let moviesArr;
let arrEarlyFilms;

const carousel = async (currentPage) => {

    movies.innerHTML = "";
    for (let index = ((currentPage - 1) * moviesPerPage); index < (currentPage * moviesPerPage); index++) {
        const movie = document.createElement("div");
        movie.classList.add("movie");
        movie.style.backgroundImage = `url(${moviesArr[index].poster_path})`;
        movie.addEventListener("click", abrirModal = async () => {
            const modal = document.querySelector(".modal");
            const modalClose = document.querySelector(".modal__close");

            const modalMovie = await (await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${moviesArr[index].id}?language=pt-BR`)).json()

            const modalTitle = document.querySelector(".modal__title");
            modalTitle.textContent = modalMovie.title;

            const modalImg = document.querySelector(".modal__img");
            modalImg.src = modalMovie.backdrop_path;

            const modalDescription = document.querySelector(".modal__description");
            modalDescription.textContent = modalMovie.overview;

            const modalAverage = document.querySelector(".modal__average");
            modalAverage.textContent = modalMovie.vote_average;

            modalMovie.genres.forEach(genre => {
                const modalGenre = document.createElement("span");
                modalGenre.classList.add("modal__genre");
                modalGenre.textContent = genre.name;

                modalGenres.append(modalGenre);
                modal.classList.remove("hidden");
            });

            modalClose.addEventListener("click", () => {
                modalGenres.innerHTML = "";
                modal.classList.add("hidden");
            });

            modal.addEventListener("click", () => {
                modalGenres.innerHTML = "";
                modal.classList.add("hidden");
            });
        });

        const movieInfo = document.createElement("div");
        movieInfo.classList.add("movie__info");

        const movieTitle = document.createElement("span");
        movieTitle.classList.add("movie__title");
        movieTitle.textContent = moviesArr[index].title;

        const movieRating = document.createElement("span");
        movieRating.classList.add("movie__rating");
        movieRating.textContent = moviesArr[index].vote_average;

        const movieIMG = document.createElement("img");
        movieIMG.src = "./assets/estrela.svg";

        movies.append(movie);
        movie.append(movieInfo);
        movieInfo.append(movieTitle, movieRating);
        movieRating.append(movieIMG);
    };
};

(async () => {
    arrEarlyFilms = await (await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false")).json();
    moviesArr = arrEarlyFilms.results;
    carousel(currentPage);
})();

btnNext.addEventListener("click", () => {
    currentPage++
    if (currentPage > Math.ceil(moviesArr.length / moviesPerPage)) {
        currentPage = 1;
    }
    carousel(currentPage);
});

btnPrev.addEventListener("click", () => {
    currentPage--
    if (currentPage < 1) {
        currentPage = Math.ceil(moviesArr.length / moviesPerPage);
    };
    carousel(currentPage);
});

input.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;

    if (event.key === "Enter" && input.value.trim() === "") {
        currentPage = 1
        movies.innerHTML = "";
        moviesArr = arrEarlyFilms.results;
        carousel(currentPage)
        return
    };

    currentPage = 1;
    movies.innerHTML = "";
    let searchMoviesArr = await (await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`)).json();
    moviesArr = searchMoviesArr.results;
    carousel(currentPage);
    input.value = "";
});

(async () => {
    const movieOfTheDay = await (await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR")).json();

    const highlightVideo = document.querySelector(".highlight__video");
    highlightVideo.style.backgroundImage = `url(${movieOfTheDay.backdrop_path})`;

    const highlightTitle = document.querySelector(".highlight__title");
    highlightTitle.textContent = movieOfTheDay.title;

    const highlightRating = document.querySelector(".highlight__rating");
    highlightRating.textContent = movieOfTheDay.vote_average;

    const highlightGenres = document.querySelector(".highlight__genres");
    let genresMovieOfTheDay = movieOfTheDay.genres.reduce((a, b) => a + b.name + ", ", "")
    highlightGenres.textContent = genresMovieOfTheDay.slice(0, genresMovieOfTheDay.length - 2)

    const highlightLaunch = document.querySelector(".highlight__launch");
    highlightLaunch.textContent = new Date(movieOfTheDay.release_date).toLocaleDateString();

    const highlightDescription = document.querySelector(".highlight__description");
    highlightDescription.textContent = movieOfTheDay.overview;

    const linkMovieOfTheDay = await (await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR")).json();

    const highlightVideoLink = document.querySelector(".highlight__video-link");
    highlightVideoLink.href = `https://www.youtube.com/watch?v=${linkMovieOfTheDay.results[0].key}`;
})();

btnTheme.src = initialTheme === "light" ? "./assets/light-mode.svg" : "./assets/dark-mode.svg";
btnPrev.src = initialTheme === "light" ? "./assets/seta-esquerda-preta.svg" : "./assets/seta-esquerda-branca.svg";
btnNext.src = initialTheme === "light" ? "./assets/seta-direita-preta.svg" : "./assets/seta-direita-branca.svg";

body.style.setProperty("--background-color", localStorage.theme === "dark" ? "#242424" : "#FFFFFF");
body.style.setProperty("--input-border-color", localStorage.theme === "dark" ? "#FFFFFF" : "#979797");
body.style.setProperty("--color", localStorage.theme === "dark" ? "#FFFFFF" : "#000000");
body.style.setProperty("--shadow-color", localStorage.theme === "dark" ? " 0px 4px 8px rgba(255, 255, 255, 0.15)" : "0px 4px 8px rgba(0, 0, 0, 0.15)");
body.style.setProperty("--highlight-background", localStorage.theme === "dark" ? "#454545" : "#FFFFFF");
body.style.setProperty("--highlight-color", localStorage.theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)");
body.style.setProperty("--highlight-description", localStorage.theme === "dark" ? "#FFFFFF" : "#0000000");

btnTheme.addEventListener("click", () => {
    btnTheme.src = btnTheme.src.includes("light-mode.svg") ? "./assets/dark-mode.svg" : "./assets/light-mode.svg";
    btnPrev.src = btnTheme.src.includes("light-mode.svg") ? "./assets/seta-esquerda-preta.svg" : "./assets/seta-esquerda-branca.svg";
    btnNext.src = btnTheme.src.includes("light-mode.svg") ? "./assets/seta-direita-preta.svg" : "./assets/seta-direita-branca.svg";

    localStorage.setItem("theme", localStorage.theme === "light" ? "dark" : "light");
    body.style.setProperty("--background-color", localStorage.theme === "dark" ? "#242424" : "#FFFFFF");
    body.style.setProperty("--input-border-color", localStorage.theme === "dark" ? "#FFFFFF" : "#979797");
    body.style.setProperty("--color", localStorage.theme === "dark" ? "#FFFFFF" : "#000000");
    body.style.setProperty("--shadow-color", localStorage.theme === "dark" ? " 0px 4px 8px rgba(255, 255, 255, 0.15)" : "0px 4px 8px rgba(0, 0, 0, 0.15)");
    body.style.setProperty("--highlight-background", localStorage.theme === "dark" ? "#454545" : "#FFFFFF");
    body.style.setProperty("--highlight-color", localStorage.theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)");
    body.style.setProperty("--highlight-description", localStorage.theme === "dark" ? "#FFFFFF" : "#0000000");
});