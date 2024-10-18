console.log(document.getElementById('plant1'));
dragElement(document.getElementById('plant1'));
dragElement(document.getElementById('plant2'));
dragElement(document.getElementById('plant3'));
dragElement(document.getElementById('plant4'));
dragElement(document.getElementById('plant5'));
dragElement(document.getElementById('plant6'));
dragElement(document.getElementById('plant7'));
dragElement(document.getElementById('plant8'));
dragElement(document.getElementById('plant9'));
dragElement(document.getElementById('plant10'));
dragElement(document.getElementById('plant11'));
dragElement(document.getElementById('plant12'));
dragElement(document.getElementById('plant13'));
dragElement(document.getElementById('plant14'));

let highestZIndex = 1; // Variable to track the highest z-index

function dragElement(terrariumElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    // Function for dragging the element
    terrariumElement.onpointerdown = pointerDrag;

    // Double click event to bring the element to the front
    terrariumElement.ondblclick = function () {
        highestZIndex++; // Increase the z-index counter
        terrariumElement.style.zIndex = highestZIndex; // Set the z-index of the clicked element to the highest
    };

    function pointerDrag(e) {
        e.preventDefault();
        pos3 = e.clientX; // Initial mouse X position
        pos4 = e.clientY; // Initial mouse Y position

        // Bind the mousemove and mouseup events
        document.onpointermove = elementDrag;
        document.onpointerup = stopElementDrag;
    }

    function elementDrag(e) {
        pos1 = pos3 - e.clientX; // Calculate X movement
        pos2 = pos4 - e.clientY; // Calculate Y movement
        pos3 = e.clientX; // Update X position
        pos4 = e.clientY; // Update Y position

        // Move the element according to the mouse movements
        terrariumElement.style.top = (terrariumElement.offsetTop - pos2) + 'px';
        terrariumElement.style.left = (terrariumElement.offsetLeft - pos1) + 'px';
    }

    function stopElementDrag() {
        // Unbind the events when the drag is stopped
        document.onpointerup = null;
        document.onpointermove = null;
    }
}