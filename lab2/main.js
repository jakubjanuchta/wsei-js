const elements = document.querySelectorAll(".slider_element"),
    parsedElements = [...elements].map((el,index)=>{
        return {el, pos: index * 100}
    }),
    button = document.querySelector(".stop"),
    dots = document.querySelectorAll(".slider_dot"),
    pauseButton = document.querySelector(".slider_button-pause");
    nextButton = document.querySelector(".slider_button-next"),
    prevButton = document.querySelector(".slider_button-prev");

let currentElementIndex = 1,
    nextElementIndex = 0;
    hasCurrentElementStartedMoving = false,
    hasNextElementStartedMoving = false;

const initInterval = (speed) => {
    return setInterval(()=>{
        parsedElements.forEach((element,index)=>{
            if(index===nextElementIndex%5){
                if(!hasNextElementStartedMoving){
                    hasNextElementStartedMoving = true;
                    element.pos = 0;
                }

                element.pos = element.pos - 1
                element.el.style.left = element.pos + "%"

                if(element.pos< -100){
                    hasNextElementStartedMoving = false
                }
            } else if(index===currentElementIndex%5){
                const currentDot = dots[index >0 ? (index%5)-1 : 4];

                if(!hasCurrentElementStartedMoving){
                    hasCurrentElementStartedMoving = true;
                    element.pos = 100

                    currentDot.style.opacity = 1
                }

                if(element.pos <= 0){
                    currentDot.style.opacity = 0.5
                    currentDot.style.borderColor = '#bbb';
                    currentElementIndex++;
                    nextElementIndex++;
                    hasCurrentElementStartedMoving = false;
                } else {
                    element.pos = element.pos - 1
                    element.el.style.left = element.pos + "%"
                }
            }
        })
    }, speed)
}

const defaultSpeed = 30,
    skipSpeed = 2;

let interval = initInterval(defaultSpeed)

const skip = (dot,index) => {
    pauseButton.disabled = true;
    nextButton.disabled = true;
    dot.style.borderColor = 'black';

    clearInterval(interval)
    const fasterInterval = initInterval(skipSpeed)

    interval = setInterval(()=>{
        if(parsedElements[index].pos === 0){
            const tempInterval = interval;
            interval = initInterval(defaultSpeed)

            clearInterval(fasterInterval)
            clearInterval(tempInterval)

            preventNextSkip = false

            pauseButton.disabled = false;
            nextButton.disabled = false;
        }
    }, skipSpeed)
}

dots.forEach((dot,index)=>{
    dot.addEventListener("click", function(){
        skip(dot,index)
    })
})


pauseButton.addEventListener("click", function(e) {
    if(e.target.innerHTML === 'PAUSE'){
        clearInterval(interval)
        interval = null
        pauseButton.innerHTML = 'PLAY'
    } else {
        interval = initInterval(defaultSpeed)
        pauseButton.innerHTML = 'PAUSE'
    }
})

nextButton.addEventListener("click", function(){
    pauseButton.innerHTML = 'PAUSE';
    skip(dots[currentElementIndex%5], currentElementIndex%5)
})

prevButton.addEventListener("click", function(){
    pauseButton.innerHTML = 'PAUSE';
    clearInterval(interval)

    let prevElementIndex = currentElementIndex%5 > 0 ? currentElementIndex%5 - 1 : 4;

    interval = setInterval(()=>{
        parsedElements.forEach((element,index)=>{
            if(index===prevElementIndex%5){
                element.pos = element.pos + 1
                element.el.style.left = element.pos + "%"
            } else if(index===currentElementIndex%5){
                if(element.pos >= 100){
                    parsedElements[prevElementIndex%5].el.style.left = "0%"
                    currentElementIndex--;
                    nextElementIndex--;
                    prevElementIndex--;
                    clearInterval(interval)
                    interval = initInterval(defaultSpeed)
                } else {
                    element.pos = element.pos + 1
                    element.el.style.left = element.pos + "%"
                }
            }
        })
    }, skipSpeed)
})