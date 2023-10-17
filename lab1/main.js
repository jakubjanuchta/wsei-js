let liczbaCounter = 0;

const liczby = [],
    inputsBox = document.querySelector(".inputs"),
    btnDodaj = document.querySelector('#dodaj'),
    btnUsun = document.querySelector('#usun'),
    minSpan = document.querySelector('#min span'),
    maxSpan = document.querySelector('#max span'),
    sredniaSpan = document.querySelector('#srednia span'),
    sumaSpan = document.querySelector('#suma span');

const addInput = () => {
    liczbaCounter++;
    const input = document.createElement("input");
    input.setAttribute("type", 'number');
    input.id = 'liczba' + liczbaCounter;
    inputsBox.appendChild(input);
    addInputOnChange(input);
    liczby.push(input);
}

const recalcValues = () => {
    let min, max, suma = 0, ilosc = 0;
        liczby.forEach(({value})=>{
            const numberValue = +value;

            if(numberValue){
                suma += numberValue;
                ilosc++;

                if( !min || numberValue < min){
                    min = numberValue;
                }

                if (!max || numberValue>max){
                    max = numberValue;
                }
            }
        })

        if(min){
            minSpan.innerHTML = +min;
        } else {
            minSpan.innerHTML = '';
        }

        if(max){
            maxSpan.innerHTML = +max;
        } else {
            maxSpan.innerHTML = '';
        }

        if(suma){
            sumaSpan.innerHTML = +suma;
            sredniaSpan.innerHTML = +(suma/ilosc);
        } else {
            sumaSpan.innerHTML = '';
            sredniaSpan.innerHTML = '';
        }
}

const addInputOnChange = (input) => {
    input.addEventListener("input", function(){
        recalcValues();
    })
}

btnDodaj.addEventListener("click", function(){
    addInput()
})

btnUsun.addEventListener("click", function(){
    liczby[liczbaCounter-1].remove()
    liczbaCounter--;

    liczby.length = liczbaCounter;
    recalcValues();

})

liczby.forEach(liczba=>{
    addInputOnChange(liczba);
})

for(let i=0; i<3; i++){
    addInput()
}