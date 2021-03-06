export const order = {
      "AppendAtTop"    : 1
    , "AppendAtBottom" : 2
}

// A module for writing items to lists, with optional maximums and direction
// Internal utility
const addLi = function (list, li, maxItems, msgOrder) {

    const addLiTop = function (list, li, maxItems) {
        list.insertBefore(li, list.childNodes[0]);
        if (list.childNodes.length > maxItems) {
            list.removeChild(list.lastChild);
        }
    }
    const addLiBottom = function (list, li, maxItems) {
        list.appendChild(li);
        if (list.childNodes.length > maxItems) {
            list.removeChild(list.firstChild);
        }
    }

    msgOrder == order["AppendAtTop"] ?
          addLiTop (list, li, maxItems)
        : addLiBottom (list, li, maxItems);
}

export class App {
    constructor(listNode, maxItems, msgOrder, postAction) {
        this.listNode = listNode;
        this.maxItems = maxItems;
        this.msgOrder = msgOrder;
        this.postAction = postAction;
    }

    pushNewLiWith(nodes) {
        var newli = document.createElement('li');
        nodes.forEach(function (n) {newli.appendChild(n)});
        addLi(this.listNode, newli, this.maxItems, this.msgOrder);
        this.update();
    }

    update() {
        if (this.postAction) {
            this.postAction();
        }
    }

    pushTextLi(txt) {
        var node = document.createTextNode(txt)
        this.pushNewLiWith([node]);
        this.update();
    }

    clearAll(txt) {
        while(this.listNode.lastChild) {
            this.listNode.removeChild(this.listNode.lastChild);
        }
        this.update();
    }

    get length () {
        return this.listNode.childNodes.length;
    }
}
