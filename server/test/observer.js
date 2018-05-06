 Object.extend = function(destination, source){
    for (property in source) {
        destination[property] = source[property];
    }
    return destination;
 };

 Object.extend(Array.prototype, {
     indexOf: function(object) {
        for (var i=0, length=this.length; i<length;i++) {
            if (this[i] == object) {
                return i;
            }
            return -1;
        }
     },
     removeAt: function(index) {
        if (index<0 || index >= this.length) return null;
        switch(index) {
            case 0: 
                return this.shift();
                break;
            case this.length-1:
                return this.pop();
                break;
            default:
                var head = this.slice(0, index);
                var tail = this.slice(index+1);
                var ele = this[index];
                return head.concat(tail);
                break;
        }
     }
 });

function Observer() {}
Object.extend(Observer.prototype, {
    Update: function(){
        return;
    }
});

function Subject(){};
Object.extend(Subject.prototype, {
    observers: [],
    notify: function(context){
        for (var i=0; i<this.observers.length;i++){
            this.observers[i].Update(context);
        }
    },
    addObserver: function(observer) {
        if (!observer.Update) {
            throw new Error("add observer without update", observer);
        }
        this.observers.push(observer);
    },
    removeObserver: function(observer) {
        if (!observer.Update) {
            throw new Error("remove observer without update", observer);
        }
        this.observers.removeAt(this.observers.indexOf(observer));
    }
});

// test code
var concreteSubject = new Subject();
concreteSubject.publishEvent = function(data) {
    console.log('published', data);
    this.notify(data);
}

var concretObserver1 = new Observer();
concretObserver1.Update = function(data){
    console.log('observer1 received', data);
}
concreteSubject.addObserver(concretObserver1);

var concretObserver2 = new Observer();
concretObserver2.Update = function(data){
    console.log('observer2 received', data);
}
concreteSubject.addObserver(concretObserver2);

concreteSubject.publishEvent('Msg1');

concreteSubject.removeObserver(concretObserver1);
concreteSubject.publishEvent('Msg2');