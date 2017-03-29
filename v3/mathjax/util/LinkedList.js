//
//  A symbol used to mark the special node used to indicate
//  the start and end of the list.
//
const END = Symbol();

//
//  The items in the doubly-linked list.
//
class ListItem {
  constructor (data = null) {
    this.data = data;
    this.next = this.prev = null;
  }
}


//
//  The generic Linked List class
//
export class LinkedList {
  //
  //  This.list is a special ListItem whose next property
  //    points to the head of the list and whose prev
  //    property points to the tail.  This lets us relink
  //    the head and tail items in the same way as any other
  //    item in the list, without having to handle special
  //    cases.
  //
  constructor(...args) {
    this.list = new ListItem(END);
    this.list.next = this.list.prev = this.list;
    this.push(...args);
  }
  
  //
  //  Used for sorting and merging lists
  //  (Overridden by subclasses)
  //
  isBefore(a,b) {
    return (a < b);
  }

  //
  //  Push items on the end of the list
  //
  push(...args) {
    for (const data of args) {
      let item = new ListItem(data);
      item.next = this.list;
      item.prev = this.list.prev;
      this.list.prev = item;
      item.prev.next = item;
    }
    return this;
  }
  
  //
  //  Pop the end item off the list and return its data
  //
  pop() {
    let item = this.list.prev;
    if (item.data === END) return null;
    this.list.prev = item.prev;
    item.prev.next = this.list;
    item.next = item.prev = null;
    return item.data;
  }
  
  //
  //  Push items at the head of the list
  //
  unshift(...args) {
    for (const data of args) {
      let item = new ListItem(data);
      item.next = this.list.next;
      item.prev = this.list;
      this.list.next = item;
      item.next.prev = item;
    }
    return this;
  }
  
  //
  //  Remove an item from the head of the list and return its data
  //
  shift() {
    let item = this.list.next;
    if (item.data === END) return null;
    this.list.next = item.next;
    item.next.prev = this.list
    item.next = item.prev = null;
    return item.data;
  }
  
  //
  //  Empty the list
  //
  Clear() {
    this.list.next = this.list.prev = this.list;
  }
  
  //
  //  Make the list iterable and return the data from
  //  the items in the list.
  //
  [Symbol.iterator]() {
    let current = this.list;
    return {
      next() {
        current = current.next;
        if (current.data === END) return {done: true};
        return {value: current.data};
      }
    }
  }
  
  //
  //  An iterator for the list in reverse order
  //
  reversed() {
    let current = this.list;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        current = current.prev;
        if (current.data === END) return {done: true};
        return {value: current.data};
      }
    }
  }
  
  //
  //  Insert a new item into a sorted list in the correct locations
  //
  insert(data,isBefore = null) {
    if (isBefore === null) isBefore = this.isBefore.bind(this);
    let item = new ListItem(data);
    let cur = this.list.next;
    while (cur.data !== END && isBefore(cur.data,item.data)) cur = cur.next;
    item.prev = cur.prev;
    item.next = cur;
    cur.prev.next = cur.prev = item;
    return this;
  }
  
  //
  //  Sort the list using an optional sort function
  //
  sort(isBefore = null) {
    if (isBefore === null) isBefore = this.isBefore.bind(this);
    //
    //  Make an array of singleton lists
    //
    let lists = [];
    for (const item of this) {
      lists.push(new LinkedList(item));
    }
    //
    //  Clear current list
    //
    this.list.next = this.list.prev = this.list;
    //
    //  Merge pairs of lists until there is only one left
    //
    while (lists.length > 1) {
      let l1 = lists.shift();
      let l2 = lists.shift();
      l1.merge(l2,isBefore);
      lists.push(l1);
    }
    //
    //  Use the final list as our list
    //
    if (lists.length) this.list = lists[0].list;
    return this;
  }
  
  //
  //  Merge a sorted list with another sorted list
  //
  merge(list,isBefore = null) {
    if (isBefore === null) isBefore = this.isBefore.bind(this);
    //
    //  Get the head of each list
    //
    let lcur = this.list.next;
    let mcur = list.list.next;
    //
    //  While there is more in both lists
    //
    while (lcur.data !== END && mcur.data !== END) {
      //
      //  If the merge item is before the list item
      //    (we have found where the head of the merge list belongs)
      //    Link the merge list into the main list at this point
      //      and make the merge list be the remainder of the original list
      //    The merge continues by looking for where the rest of the original
      //      list fits into the newly formed main list (the old merge list).
      //  Otherwise
      //    Go on to the next item in the main list
      //
      if (isBefore(mcur.data,lcur.data)) {
        [mcur.prev.next,lcur.prev.next] = [lcur,mcur];
        [mcur.prev,lcur.prev] = [lcur.prev,mcur.prev];
        [this.list.prev.next,list.list.prev.next] = [list.list,this.list];
        [this.list.prev,list.list.prev] = [list.list.prev,this.list.prev];
        [lcur,mcur] = [mcur.next,lcur];
      } else {
        lcur = lcur.next;
      }
    }
    //
    //  If there is more to be merged (i.e., we came to the end of the main list),
    //  then link that at the end of the main list.
    //
    if (mcur.data !== END) {
      this.list.prev.next = list.list.next;
      list.list.next.prev = this.list.prev;
      list.list.prev.next = this.list;
      this.list.prev = list.list.prev;
      list.list.next = list.list.prev = list.list;
    }
    return this;
  }
}