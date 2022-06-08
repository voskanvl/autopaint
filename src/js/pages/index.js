import "../../style/page/style.sass";

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
    baloon.style.transform = `translateX(${x * kX}%)`;
};
const relativeCoords = ({ x, y, container, coordsBegin }) => {
    console.log({
        x: ((x - coordsBegin.x) / container.clientWidth) * 100,
        y: ((y - coordsBegin.y) / container.clientHeight) * 100,
    });
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
            kX: -0.3,
            kY: -2,
        });
    }, 200),
);
