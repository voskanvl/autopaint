import "../../style/page/style.sass";

const caption = document.querySelector(".caption");
caption.addEventListener("mousemove", ({ x, y }) => {
    console.log(x, y, caption.clientWidth, caption.clientHeight);
});
