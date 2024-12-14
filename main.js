const keys = document.querySelectorAll('.key');   //Select all elements with class="key"

const display_input = document.querySelector('.display .input');   //Get the first element with class="display input"
const display_output = document.querySelector('.display .output');  //Get the first element with class="dispaly output"


let input =""; //做一個空集合

for (let key of keys) {
    const value = key.dataset.key; //dataset 是 DOM 中專門用來存取 data- 屬性的 value
    //當用戶點擊這個按鍵時，會執行對應的回呼函數（箭頭函數 () => { ... } 中的程式碼）
    key.addEventListener('click',() =>{
        if(value == "clear"){
            input ="";
            display_input.innerHTML ="";
            display_output.innerHTML = "";
        } else if (value == "backspace"){
            input = input.slice(0,-1);   //從索引 0 開始截取，去掉最後一個字元。
            display_input.innerHTML = CleanInput(input);
        } else if (value == "="){
            let result = eval(PerpareInput(input));

            display_output.innerHTML = CleanOutput(result);
        } else if (value == "brackets"){
            if (
                //-1 是 indexOf 無法找到目標字元時的返回值，因此可以用來判斷「是否沒有找到某個字元」。
                input.indexOf("(") == -1 ||    
                input.indexOf("(") != -1 &&
                input.indexOf(")") != -1 &&
                input.lastIndexOf("(") < input.lastIndexOf(")")   //"(2+3)" lastIndexOf("(") 返回 0。 lastIndexOf(")") 返回 5。
 
            ) {
                input += "(";

            } else if (
                input.indexOf("(") != -1 &&
                input.indexOf(")") == -1 ||
                input.indexOf("(") != -1 &&
                input.indexOf(")") != -1 &&
                input.lastIndexOf("(") > input.lastIndexOf(")")
            ) {
                input += ")";
            }

            display_input.innerHTML = CleanInput(input);
        } else {
            if(ValidateInput(value)){
                input += value;
                display_input.innerHTML = CleanInput(input);
            }
        }
        })
}


function CleanInput(input){
    let input_array = input.split("");
    let input_array_length = input_array.length;

    for (let i =0; i< input_array_length; i++){
        if (input_array[i] == "*"){
            input_array[i] = `<span class="operator">x</span>`;
        } else if (input_array[i] == "/"){
            input_array[i] = `<span class="operator">÷</span>`;
        } else if (input_array[i] == "+"){
            input_array[i] = `<span class="operator">+</span>`;
        } else if (input_array[i] == "-"){
            input_array[i] = `<span class="operator">-</span>`;
        } else if (input_array[i] == "("){
            input_array[i] = `<span class="brackets">(</span>`;
        } else if (input_array[i] == ")"){
            input_array[i] = `<span class="brackets">)</span>`;
        } else if (input_array[i] == "%"){
            input_array[i] = `<span class="percent">%</span>`;
        }
    }
    return input_array.join("");   //input_array.join("")：將處理後的陣列重新拼接成字串。
}


function CleanOutput(output){
    let output_string = output.toString();
    let decimal = output_string.split(".")[1];   //把小數點後面的數字與整數分開
    output_string = output_string.split(".")[0]; //把整數部分與小數點分開

    let output_array = output_string.split("");  //在把整數用""分開

    if (output_array.length > 3){
        for (let i = output_array.length - 3; i >0; i -=3){
            output_array.splice(i, 0, ",");    //array.splice(index, count, item1, ....., itemX)   count:Optional,Number of items to be removed.
            
        }
    }
    if (decimal){    //若有小數點，則為true, 就會執行以下指令
        output_array.push(".");
        output_array.push(decimal);
    }
    return output_array.join("");
}

function ValidateInput(value){    //處理輸入的問題，operator不能輸入兩次
    let last_input = input.slice(-1);
    let operators = ["+","-","*","/"];

    if (value == "." && last_input == "."){
        return false;
    }

    if (operators.includes(value)){
        if(operators.includes(last_input)){
            return false;
        } else {
            return true;
        }
    }
    return true;
}


function PerpareInput(input){
    let input_array = input.split("");

    for (let i =0; i< input_array.length;i++){
        if (input_array[i] == "%"){
            input_array[i] = "/100";
        }
    }
    return input_array.join("");
}