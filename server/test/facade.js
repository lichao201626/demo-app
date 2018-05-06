function IEBrowser() {
    this.hello = function() {
        console.log("IE browser");
    }
}
function NoneIEBrowser() {
    this.hello = function(){
        console.log('None IE browser');
    }
}

var Facade = {};
Facade.hello = function(){
    console.log('in facade hello', this.window);
    var browser;
    if(this.window){
        browser  = new IEBrowser();
    } else {
        browser = new NoneIEBrowser();
        browser.hello(); 
    }
};
console.log('sssssssssssss');
Facade.hello();