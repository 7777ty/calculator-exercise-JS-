const ul =document.querySelector('ul');
const currentInput=document.getElementsByClassName('currentInput');
const clear =document.getElementsByClassName('clear');
const onDelete =document.getElementsByClassName('onDelete');
const onCalculate = document.getElementsByClassName('onCalculate');
const numberString='0123456789';
const operatorString='+-*/%';
let historyInput=document.getElementsByClassName('history');
let suffixExpression=[];
let numberStack=[];
let result=document.getElementsByClassName('result');


ul.addEventListener('click',(e)=>{
    console.log(currentInput[0].innerHTML);
    if (currentInput[0].innerHTML===''){
        return
    }
    let input=e.target.textContent;
    let currentOutput=currentInput[0].innerHTML;
    let length=currentInput[0].firstChild.length;
    if (numberString.includes(input)||operatorString.includes(input)||input==='.'){
        if (length >= 16) {
            return;
        }
        if (currentOutput === '0') {
            if (numberString.includes(input)) {
                currentInput[0].innerHTML = input;
            } else if (operatorString.includes(input)|| input==='.') {
                currentInput[0].innerHTML += input;
            }
            return;
        }
        if(operatorString.includes(currentOutput[length-1]) && input==='.'){return;}
        if(currentOutput.includes('.') && input==='.'){
            if(!(currentOutput.slice(currentOutput.lastIndexOf('.')).match(/\+[0-9]|\-[0-9]|\*[0-9]|\/[0-9]|\%[0-9]?/))){
                return;
            }
        }
        if (operatorString.includes(input)){
            if (operatorString.includes(currentOutput[length-1])||currentOutput.endsWith('.')){
                return;
            }
        }
        currentInput[0].innerHTML +=input;
    }
});

onCalculate[0].addEventListener('click',()=> {
    let currentOutput = currentInput[0].innerHTML;
    if (currentOutput==='' || currentOutput==='0'){
        return
    }
    toRPolish(currentOutput);
    suffixExpression.forEach((e) => {
            if (!(operatorString.includes(e))) {
                numberStack.push(e);
            } else {
                const number1 = parseFloat(numberStack.pop());
                const number2 = parseFloat(numberStack.pop());
                let sum = 0;
                switch (e) {
                    case '+': {
                        sum = number1 + number2;
                        numberStack.push(sum);
                        break
                    }
                    case '-': {
                        sum = number2 - number1;
                        numberStack.push(sum);
                        break
                    }
                    case '*': {
                        sum = number1 * number2;
                        numberStack.push(sum);
                        break
                    }
                    case '/': {
                        if (number1 === 0) {
                            window.alert("除数不能为0！！！");
                            historyInput[0].innerHTML ='';
                            break;
                        }
                        sum = number2 / number1;
                        this.numberStack.push(sum);
                        break;
                    }
                    case '%': {
                        if (!(Number.isInteger(number2) && Number.isInteger(number1))) {
                            window.alert("求余运算两边必须是整数！！！");
                            historyInput[0].innerHTML = '';
                            break;
                        }
                        if (number1 === 0) {
                            window.alert("求余运算的分母不可为0！！！");
                            historyInput[0].innerHTML = '';
                            break;
                        }
                        sum = number2 % number1;
                        numberStack.push(sum);
                        break;
                    }
                }
            }
        });
    if (!historyInput[0].innerHTML){
        currentInput[0].innerHTML='0';
        result[0].innerHTML='';
    }else{
        result[0].innerHTML=numberStack.pop();
        currentInput[0].innerHTML='';
    }
    suffixExpression=[];
});

clear[0].addEventListener('click',()=>{
    currentInput[0].innerHTML='0';
    result[0].innerHTML='';
    historyInput[0].innerHTML='';
});

onDelete[0].addEventListener('click',()=>{
    if(currentInput[0].innerHTML.length>1){
        currentInput[0].innerHTML=currentInput[0].innerHTML.substring(0, currentInput[0].innerHTML.length - 1);
    }else {
        currentInput[0].innerHTML='0';
        result[0].innerHTML='';
        historyInput[0].innerHTML='';
    }
});





    function toRPolish(input) {
        let S1 = []; //操作数栈
        let S2 = []; //运算符栈
        let flag = true;
        const currentOutput = currentInput[0].innerHTML;
        if (operatorString.includes(input[input.length - 1])) {
            input = input.substring(0, input.length - 1);
        }
        for (let i = 0; i < input.length; i++) {
            if (numberString.includes(input[i])) {
                for (let j = i; j < input.length; j++) {
                    if (operatorString.includes(input[j])) {
                        S1.push(input.slice(i, j));
                        if (S2.length === 0 || !toCompareOperator(S2[S2.length - 1], input[j])) {
                            S2.push(input[j]);
                            flag = false;
                        } else if (toCompareOperator(S2[S2.length - 1], input[j])) {
                            flag = true;
                            S1.push(S2.pop());
                            while (flag) {
                                if (S2.length === 0 || !toCompareOperator(S2[S2.length - 1], input[j])) {
                                    S2.push(input[j]);
                                    flag = false;
                                } else if (toCompareOperator(S2[S2.length - 1], input[j])) {
                                    S1.push(S2.pop());
                                }
                            }
                        }
                        i = j;
                        break;
                    } else if (j === input.length - 1) {
                        S1.push(input.slice(i, j + 1));
                        while (S2.length > 0) {
                            S1.push(S2.pop());
                        }
                        i = j;
                    }
                }
            }
        }
        suffixExpression = S1;
        historyInput[0].innerHTML = currentOutput;
    }
    function toCompareOperator(a, b) {
        if (a === '*' || a === '/' || a === '%') {
            return true
        } else if ((a === '+' || a === '-') && ((b === '*' || b === '/' || b === '%'))) {
            return false
        }
    }
