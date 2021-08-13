
class requestHandler{
    constructor(request){
        this.request = request;
    }

    setRequest(request){
        this.request = request;
    }

    getRequest(){
        return request;
    }
}


module.exports = {
    "request": requestHandler
}