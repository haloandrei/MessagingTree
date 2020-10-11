/*
 * @name MessageTree
 * @description A messaging app that uses a tree representation
 */
let spaceSlider, sizeSlider, childSlider;
let inputMessage, buttonSendMsg;
let btnUp, BtnDown;
let messageTree1;
function computeDistanceEuler(angle, lenght){
    if (angle == 0) return lenght;
    return lenght/cos(angle);
}

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
        this.distanceFactor = 10;
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
        //ellipse(0, 0, textWidth(this.message) + this.paddingText, this.fontSizeText + this.paddingText);
        rect(0,0, textWidth(this.message) + this.paddingText, this.fontSizeText + this.paddingText, 10);
        textFont('Arial', this.fontSizeText);
        fill(0);
        text(this.message, 0 - textWidth(this.message) / 2, 0 + this.fontSizeText / 2);
    }

    clicked(){
        messageTree1.currentMessage = this;
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
        this.h = 100;
    }

    setRenderSize(width, height) {
        this.maxWidth = width;
        this.maxHeight = height;
    }

    updateAll(message){

        message.fontSizeText = this.textFontSize;
        for (let i = 0; i < message.index; i++) {
            this.updateAll(message.children[i]);
        }

    }

    moveUp() {
        if (this.currentMessage.parent === null) return;
        this.currentMessage = this.currentMessage.parent;
    }

    moveDown(child) {
        this.currentMessage = child;
    }

    renderTree(message) {
        rectMode(CENTER);
        translate(width/2,height/2);

        fill(255,0,0);
        circle(0,0,10);
        push();
        this.renderRecursion(message, this.h - this.distanceFactor, this.textFontSize - this.distanceFactor);
        pop();
        push();
        this.renderRecursionUp(message.parent,message, this.h - this.distanceFactor, this.textFontSize - this.distanceFactor);
        pop();
        fill(185);
        //filter(BLUR, 3);
        message.fontSizeText = this.textFontSize;
        message.renderMessage();
    }

    renderRecursion(message, lenghtNode, sizeNode){
        let curvature = 10;
        // tint(255,127);
        // scale(1.2);
        // message.renderMessage();
        //filter(BLUR, 0);
        let angle = 70;
        let theta = angle * 2 / (message.index-1);
        for (let i = 0; i < message.index; i++) {
            push();
            rotate(angle - theta * i);
            stroke(20 + (i*40), 0, 0);
            strokeWeight(sizeNode/10);

            let distance =  computeDistanceEuler((angle - theta * i),lenghtNode);
            line(0, 0, 0, distance);
            translate(0, distance);
            rotate(theta * i - angle);

            this.renderRecursion(message.children[i], lenghtNode - this.distanceFactor, sizeNode - this.distanceFactor);

            pop();
        }
        message.fontSizeText = sizeNode;
        message.renderMessage();
    }

    // renderView() {
    //     //ToDo change font coupling
    //     if(this.currentMessage.parent != null){
    //         this.currentMessage.parent.fontSizeText = this.textFontSize;
    //         this.currentMessage.fontSizeText = this.textFontSize;
    //         this.currentMessage.parent.x = this.maxWidth / 2;
    //         this.currentMessage.parent.y = this.maxHeight / 2 - this.root.getFontSize() * this.spacingBetweenNodes;
    //         this.currentMessage.parent.renderMessage();
    //         stroke(187);
    //         strokeWeight(this.textFontSize/6);
    //         line(this.maxWidth / 2, this.maxHeight / 2 - this.root.getFontSize() * (this.spacingBetweenNodes-1), this.maxWidth / 2, this.maxHeight/2- this.root.getFontSize());
    //     }
    //     this.currentMessage.x = this.maxWidth / 2;
    //     this.currentMessage.y = this.maxHeight / 2;
    //     this.currentMessage.renderMessage();
    //
    //
    //     let currX = childSlider.value() - 255 ;
    //
    //     for (let i = 0; i < this.currentMessage.index; i++) {
    //         currX = currX+ textWidth(this.currentMessage.children[i].message)/2 +30;
    //         if (textWidth(this.currentMessage.children[i].message) <= this.maxWidth - currX) {
    //             this.currentMessage.children[i].fontSizeText = this.textFontSize;
    //             this.currentMessage.children[i].x = currX;
    //             this.currentMessage.children[i].y = this.maxHeight/2 + this.root.getFontSize() * this.spacingBetweenNodes;
    //             this.currentMessage.children[i].renderMessage();
    //             stroke(187);
    //             strokeWeight(this.textFontSize/10);
    //             line(currX, this.maxHeight / 2 + this.root.getFontSize() * (this.spacingBetweenNodes-1), this.maxWidth/2, this.maxHeight/2 + this.root.getFontSize());
    //             currX = currX + textWidth(this.currentMessage.children[i].message)/2 + 10;
    //         } else {
    //             stroke(187);
    //             strokeWeight(this.textFontSize/10);
    //             line(currX, this.maxHeight / 2 + this.root.getFontSize() * (this.spacingBetweenNodes-1), this.maxWidth/2, this.maxHeight/2 + this.root.getFontSize());
    //             break;
    //         }
    //     }
    // }

    renderRecursionUp(parent, message, lenghtNode, sizeNode) {
        if (parent == null) return;
        let distance = lenghtNode;
        rotate(180);
        stroke(60, 0, 50);
        strokeWeight(sizeNode/10);
        line(0, 0, 0, distance);
        translate(0, distance);
        rotate(180);
        let angle = 160;
        let theta = angle / (message.index-1);
        for (let i = 0; i < parent.index; i++)
            if (message === parent.children[i]) continue;
            else{
                push();
                rotate(- theta * i);
                stroke(20 + (i*40), 0, 0);
                strokeWeight(sizeNode/10);

                let distance =  computeDistanceEuler((angle - theta * i), lenghtNode);
                line(0, 0, 0, distance);
                translate(0, distance);
                rotate(theta * i);

                this.renderRecursion(parent.children[i], lenghtNode - this.distanceFactor, sizeNode - this.distanceFactor);

                pop();
            }
        push();
        this.renderRecursionUp(parent.parent, parent, lenghtNode - this.distanceFactor, sizeNode - this.distanceFactor);
        pop();
        parent.fontSizeText = sizeNode;
        parent.renderMessage();
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    spaceSlider = createSlider(10, 200, 100);
    spaceSlider.position(20, 20);
    sizeSlider = createSlider(0, 60, 40);
    sizeSlider.position(20, 50);
    childSlider = createSlider(0, 100, 10);
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
    message6 = new Message("i m down for it");
    message7 = new Message("Sry i can t");
    message8 = new Message("eyy man cmon, everyone s comming");
    message9 = new Message("too bad");

    message2.send(message1);
    message3.send(message2);
    message4.send(message2);
    message5.send(message2);
    message6.send(message4);
    message7.send(message1);
    message8.send(message7);
    message9.send(message7);

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
    angleMode(DEGREES);
    messageTree1.renderTree(messageTree1.currentMessage);
    messageTree1.h = spaceSlider.value();
    messageTree1.textFontSize = sizeSlider.value();
    messageTree1.distanceFactor = childSlider.value();
}


