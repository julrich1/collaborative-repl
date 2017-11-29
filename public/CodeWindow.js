class CodeWindow {
  constructor(cw) {
    this.codeWindow = cw;
    this.currentLine = 0;
    this.cursorPosition = 0;
  }

  clearWindow() {
    while (this.codeWindow.firstChild) {
      this.codeWindow.removeChild(this.codeWindow.firstChild);
    }
  }

  initializeInput(data) {
    this.clearWindow();
    let lineNumber = 0;

    for (const line of data) {
      this.processInput(line, lineNumber++);
    }
  }

  processInput(key, lineNumber, cursorPos) {
    if (key === "LeftArrow" || key === "RightArrow" || key === "UpArrow" || key === "DownArrow" || key === "Enter") {
      this.moveCursor(key);
    }
    else {
      this.cursorPosition++;
      if (!this.codeWindow.children[lineNumber]) {
        const newSpan = document.createElement("span");
        
        this.codeWindow.appendChild(newSpan);
      }
  
      let currentText = this.codeWindow.children[lineNumber].textContent;
  
      console.log("Slicing at cursorPos: ", cursorPos);
      this.codeWindow.children[lineNumber].textContent = currentText.slice(0, cursorPos) + key + currentText.slice(cursorPos);
    }

    
    // this.codeWindow.children[lineNumber].textContent += text;
  }

  moveCursor(action) {
    if (action === "LeftArrow") {
      if (this.cursorPosition > 0)
        this.cursorPosition--;
    }
    else if (action === "RightArrow") {
      this.cursorPosition++;
    }
    else if (action === "UpArrow") {
      this.cursorPosition = 0;
      this.currentLine--;
    }
    else if (action === "DownArrow") {
      this.cursorPosition = 0;
      this.currentLine++;
    }
    else if (action === "Enter") {
      this.currentLine++;
      this.cursorPosition = 0;
    }
  }
  
}