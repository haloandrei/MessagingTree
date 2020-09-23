/*
 * @name MessageTree
 * @description A messaging app that uses a tree representation
 */
let spaceSlider, sizeSlider, childSlider;
let inputMessage, buttonSendMsg;
let btnUp, BtnDown;
class Message {
    constructor(message) {
        this.x = 10;
        this.y = 10;
        this.parent = null;
        this.message = message;
        this.children = [];
        this.index = 0;
        this.paddingText = 20;
        this.fontSizeText = 20;
    }

    getFontSize() {
        return this.fontSizeText;
    }

    repply(child) {
        this.children[this.index++] = child;
        child.parent = this;
        //update view
    }

    send(toMessage) {
        toMessage.repply(this)
        this.parent = toMessage;
    }

    changeParent(newParent) {
        this.parent = newParent;
        //update view
    }

    renderMessage() {
        stroke(255);
        strokeWeight(1);
        fill(255);
        ellipse(this.x, this.y, textWidth(this.message) + this.paddingText, this.fontSizeText + this.paddingText);
        textFont('Arial', this.fontSizeText);
        fill(0);

        text(this.message, this.x - textWidth(this.message) / 2, this.y + this.fontSizeText / 2)

    }
}

class Group {
    constructor(root) {
        this.root = root;
        this.currentMessage = root;
        this.maxWidth = 100;
        this.maxHeight = 100;
        this.spacingBetweenNodes = 6;
        this.textFontSize = 40;
    }

    setRenderSize(width, height) {
        this.maxWidth = width;
        this.maxHeight = height;
    }


    moveUp() {
        this.currentMessage = this.currentMessage.parent;
    }

    moveDown(child) {
        this.currentMessage = child;
    }

    renderView() {
        //ToDo change font coupling
        if(this.currentMessage.parent != null){
            this.currentMessage.parent.fontSizeText = this.textFontSize;
            this.currentMessage.fontSizeText = this.textFontSize;
            this.currentMessage.parent.x = this.maxWidth / 2;
            this.currentMessage.parent.y = this.maxHeight / 2 - this.root.getFontSize() * this.spacingBetweenNodes;
            this.currentMessage.parent.renderMessage();
            stroke(187);
            strokeWeight(this.textFontSize/6);
            line(this.maxWidth / 2, this.maxHeight / 2 - this.root.getFontSize() * (this.spacingBetweenNodes-1), this.maxWidth / 2, this.maxHeight/2- this.root.getFontSize());
        }
        this.currentMessage.x = this.maxWidth / 2;
        this.currentMessage.y = this.maxHeight / 2;
        this.currentMessage.renderMessage();


        let currX = childSlider.value() - 255 ;

        for (let i = 0; i < this.currentMessage.index; i++) {
            currX = currX+ textWidth(this.currentMessage.children[i].message)/2 +30;
            if (textWidth(this.currentMessage.children[i].message) <= this.maxWidth - currX) {
                this.currentMessage.children[i].fontSizeText = this.textFontSize;
                this.currentMessage.children[i].x = currX;
                this.currentMessage.children[i].y = this.maxHeight/2 + this.root.getFontSize() * this.spacingBetweenNodes;
                this.currentMessage.children[i].renderMessage();
                stroke(187);
                strokeWeight(this.textFontSize/10);
                line(currX, this.maxHeight / 2 + this.root.getFontSize() * (this.spacingBetweenNodes-1), this.maxWidth/2, this.maxHeight/2 + this.root.getFontSize());
                currX = currX + textWidth(this.currentMessage.children[i].message)/2 + 10;
            } else {
                stroke(187);
                strokeWeight(this.textFontSize/10);
                line(currX, this.maxHeight / 2 + this.root.getFontSize() * (this.spacingBetweenNodes-1), this.maxWidth/2, this.maxHeight/2 + this.root.getFontSize());
                break;
            }
        }
    }
}

function setup() {
    createCanvas(700, 500);
    frameRate(30);
    spaceSlider = createSlider(2, 10, 5);
    spaceSlider.position(20, 20);
    sizeSlider = createSlider(0, 60, 40);
    sizeSlider.position(20, 50);
    childSlider = createSlider(0, 500, 255);
    childSlider.position(20, 80);
    input = createInput();
    input.position(20, 100);

    button = createButton('submit');
    button.position(input.x + input.width, 100);
    button.mousePressed(sendMessage);

    btnUp = createButton('Up');
    btnUp.position(width - 70, 50);
    btnUp.mousePressed(goUp);
    btnDown = createButton('Down');
    btnDown.position(width - 70, 70);
    btnDown.mousePressed(goDown);

    message1 = new Message("Wanna go out?");
    message2 = new Message("sure, when?");

    message3 = new Message("Idk, whenever you want");
    message4 = new Message("What about 4?");
    message5 = new Message("what about 5?");

    message2.send(message1);
    message3.send(message2);
    message4.send(message2);
    message5.send(message2);

    messageTree1 = new Group(message1);
    messageTree1.setRenderSize(width, height);
    messageTree1.moveDown(message2);

}

function sendMessage(){
    let txtMsg = input.value();
    input.value('');
    let msgNew = new Message(txtMsg);
    msgNew.send(messageTree1.currentMessage);

}
function goUp(){
    messageTree1.moveUp();
}
function goDown(){
    let r = int(random(messageTree1.currentMessage.index-1));
    if (messageTree1.currentMessage.index > 0)
        messageTree1.moveDown(messageTree1.currentMessage.children[r]);
}
function draw() {
    background(spaceSlider.value()*10 + 100 , sizeSlider.value() +100 ,childSlider.value());
    messageTree1.renderView();
    messageTree1.spacingBetweenNodes = spaceSlider.value();
    messageTree1.textFontSize = sizeSlider.value();
}
