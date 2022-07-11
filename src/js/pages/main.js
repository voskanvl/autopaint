import Splide from "@splidejs/splide";
import Inputmask from "inputmask";

const caption = document.querySelector(".caption");
const baloon = document.querySelector(".baloon");

const debounce = (f, ms) => {
    let isCooldown = false;
    return function () {
        if (isCooldown) return;
        f.apply(this, arguments);
        isCooldown = true;
        setTimeout(() => (isCooldown = false), ms);
    };
};
const shiftBaloon = ({ x, y, kX = 1, kY = 1 }) => {
    baloon.style.transform = `translateX(${x * kX}%) translateY(${y * kY}%)`;
};
const relativeCoords = ({ x, y, container, coordsBegin }) => {
    return {
        x: ((x - coordsBegin.x) / container.clientWidth) * 100,
        y: ((y - coordsBegin.y) / container.clientHeight) * 100,
    };
};
const beginCoords = container => {
    return {
        x: container.offsetWidth / 2,
        y: container.offsetHeight / 2,
    };
};
caption.addEventListener(
    "mousemove",
    debounce(({ clientX: x, clientY: y }) => {
        shiftBaloon({
            ...relativeCoords({
                x,
                y,
                container: caption,
                coordsBegin: beginCoords(caption),
            }),
            kX: -0.1,
            kY: -0.05,
        });
    }, 100),
);

if (document.readyState !== "loading") {
    start();
} else {
    document.addEventListener("DOMContentLoaded", () => start());
}

function start() {
    const monitor = document.querySelector("#monitor");
    const close = document.querySelector(".modal__cross");
    const burger = document.querySelector(".menu__burger");
    const modal = document.querySelector(".modal");

    const send = document.querySelector(".button.form__button");

    const slider = new Splide("#splide", {
        type: "loop",
        perPage: 1,
        autoWidth: true,
        arrowPath:
            "M13 19.25C12.5858 19.25 12.25 19.5858 12.25 20C12.25 20.4142 12.5858 20.75 13 20.75L13 19.25ZM26.5303 20.5303C26.8232 20.2374 26.8232 19.7626 26.5303 19.4697L21.7574 14.6967C21.4645 14.4038 20.9896 14.4038 20.6967 14.6967C20.4038 14.9896 20.4038 15.4645 20.6967 15.7574L24.9393 20L20.6967 24.2426C20.4038 24.5355 20.4038 25.0104 20.6967 25.3033C20.9896 25.5962 21.4645 25.5962 21.7574 25.3033L26.5303 20.5303ZM13 20.75L26 20.75L26 19.25L13 19.25L13 20.75Z",
        pagination: false,
    }).mount();
    slider.on(
        "move",
        newIndex =>
            (monitor.innerHTML = [
                "#FFA826",
                "#00B1AB",
                "#C9D5FD",
                "#CAF68A",
                "#15100A",
            ][newIndex]),
    );

    const sliderCarousel = new Splide("#splideServices", {
        type: "loop",
        perPage: 1,
        autoWidth: true,
        arrowPath:
            "M13 19.25C12.5858 19.25 12.25 19.5858 12.25 20C12.25 20.4142 12.5858 20.75 13 20.75L13 19.25ZM26.5303 20.5303C26.8232 20.2374 26.8232 19.7626 26.5303 19.4697L21.7574 14.6967C21.4645 14.4038 20.9896 14.4038 20.6967 14.6967C20.4038 14.9896 20.4038 15.4645 20.6967 15.7574L24.9393 20L20.6967 24.2426C20.4038 24.5355 20.4038 25.0104 20.6967 25.3033C20.9896 25.5962 21.4645 25.5962 21.7574 25.3033L26.5303 20.5303ZM13 20.75L26 20.75L26 19.25L13 19.25L13 20.75Z",
        pagination: false,
    }).mount();

    const closeModal = () => (modal.style.display = "none");
    const openModal = () => {
        modal.style.display = "block";
    };
    close.addEventListener("click", closeModal);
    burger.addEventListener("click", openModal);

    const navs = document.querySelectorAll(".modal__nav a");
    const modalBook = document.querySelectorAll(".modal__book a");
    console.log("🚀 ~ modalBook", modalBook);

    function closeDelayed(elements) {
        [...elements].forEach(a =>
            a.addEventListener("click", () => setTimeout(closeModal, 200)),
        );
    }

    closeDelayed(navs);
    closeDelayed(modalBook);

    //--- VALIDATION ---
    const nameInput = document.querySelector(".form__name");
    const phoneInput = document.querySelector(".form__phone");
    const emailInput = document.querySelector(".form__email");
    const textInput = document.querySelector(".form__text");

    const isValidAllFields = () => {
        const isValidPhone = phoneInput.checkValidity();
        const isValidEmail = emailInput.checkValidity();
        const isValidText = textInput.checkValidity();
        const isValidName = nameInput.checkValidity();
        return isValidPhone && isValidEmail && isValidText && isValidName;
    };

    [...document.forms[0].elements].forEach(e =>
        e.addEventListener("click", () => e.removeAttribute("untouched")),
    );

    const phoneMask = new Inputmask("+7(999) 999-99-99");
    phoneMask.mask(phoneInput);
    const emailMask = new Inputmask({ regex: "\\w+@\\w+\\.\\w+" });
    emailMask.mask(emailInput);
    const textMask = new Inputmask({ regex: "[a-zA-Zа-яёА-ЯЁ0-9]{1,}" });
    textMask.mask(textInput);
    const nameMask = new Inputmask({ regex: "[a-zA-Zа-яёА-ЯЁ0-9]{1,}" });
    nameMask.mask(nameInput);

    send.addEventListener("click", event => {
        event.preventDefault();
        const queryMap = {
            name: encodeURIComponent(nameInput.value),
            phone: encodeURIComponent(phoneInput.value),
            email: encodeURIComponent(emailInput.value),
            text: encodeURIComponent(textInput.value),
        };
        if (isValidAllFields()) {
            fetch("/mail.php", {
                method: "POST",
                body: new FormData(document.forms[0]),
            })
                .then(r => {
                    if (r.ok) {
                        [...document.forms[0].elements].forEach(e => {
                            e.value = "";
                            e.setAttribute("untouched", true);
                        });
                        send.setAttribute("disabled", true);
                        send.textContent = "Ваша заявка отправлена успешно";
                        setTimeout(() => {
                            send.removeAttribute("disabled");
                            send.textContent = "Записаться";
                        }, 5000);
                    }
                })
                .catch(console.log);
        } else {
            [...document.forms[0].elements]
                .filter(e => e.type !== "submit")
                .forEach((e, i) => setTimeout(() => e.reportValidity(), 1000));
        }
    });
}
