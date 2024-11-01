let highestZIndex = 10;

let offsetX = 0;
let offsetY = 0;

function dragStart(e) {
    const plant = e.target;
    offsetX = e.clientX - plant.offsetLeft;
    offsetY = e.clientY - plant.offsetTop;
    e.dataTransfer.setData("text/plain", e.target.id);
    plant.style.zIndex = highestZIndex;
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();

    const id = e.dataTransfer.getData("text");
    const plant = document.getElementById(id);
    const newLeft = e.clientX - offsetX;
    const newTop = e.clientY - offsetY;
    plant.style.left = `${newLeft}px`;
    plant.style.top = `${newTop}px`;
    plant.style.zIndex = highestZIndex;
    plant.setAttribute("draggable", "true");
}

function goTopElement(e) {
    highestZIndex++;
    const plant = e.target;
    plant.style.zIndex = highestZIndex;
}

document.querySelectorAll(".plant").forEach((plant) => {
    plant.addEventListener("dragstart", dragStart);
    plant.addEventListener("dblclick", goTopElement);
    plant.setAttribute("draggable", "true"); 
});

document.body.addEventListener("dragover", dragOver);
document.body.addEventListener("drop", drop);
