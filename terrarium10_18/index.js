console.log(document.getElementById('plant1'))
dragElement(document.getElementById('plant1'))
dragElement(document.getElementById('plant2'))
dragElement(document.getElementById('plant3'))
dragElement(document.getElementById('plant4'))
dragElement(document.getElementById('plant5'))
dragElement(document.getElementById('plant6'))
dragElement(document.getElementById('plant7'))
dragElement(document.getElementById('plant8'))
dragElement(document.getElementById('plant9'))
dragElement(document.getElementById('plant10'))
dragElement(document.getElementById('plant11'))
dragElement(document.getElementById('plant12'))
dragElement(document.getElementById('plant13'))
dragElement(document.getElementById('plant14'))


let highestZIndex = 1; // 가장 높은 z-index를 저장할 변수

function dragElement(terrariumElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    terrariumElement.onpointerdown = pointerDrag;

    // 더블 클릭 시 요소를 가장 위로 가져오는 기능
    terrariumElement.ondblclick = function () {
        highestZIndex++; // 현재 z-index의 최대값을 증가시킴
        terrariumElement.style.zIndex = highestZIndex; // 해당 요소의 z-index를 가장 큰 값으로 설정
    };

    function pointerDrag(e) {
        e.preventDefault();
        pos3 = e.clientX; // 마우스의 초기 X 위치
        pos4 = e.clientY; // 마우스의 초기 Y 위치

        // 마우스 움직임과 관련된 이벤트를 설정
        document.onpointermove = elementDrag;
        // 마우스 버튼을 뗐을 때 드래그 중지
        document.onpointerup = stopElementDrag;
    }

    function elementDrag(e) {
        pos1 = pos3 - e.clientX; // 마우스의 X 이동 거리
        pos2 = pos4 - e.clientY; // 마우스의 Y 이동 거리
        pos3 = e.clientX; // 현재 마우스 X 위치 갱신
        pos4 = e.clientY; // 현재 마우스 Y 위치 갱신

        // 요소의 새로운 위치 계산 및 적용
        terrariumElement.style.top = (terrariumElement.offsetTop - pos2) + 'px';
        terrariumElement.style.left = (terrariumElement.offsetLeft - pos1) + 'px';
    }

    function stopElementDrag() {
        // 마우스 버튼을 떼면 이벤트를 제거하여 드래그 중지
        document.onpointerup = null;
        document.onpointermove = null;
    }
}