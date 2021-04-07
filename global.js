class Global{
    /*
    SINGLETON
     */
    constructor() {
    }
    get instance(){
        if (!this._instance){
            this._instance = {}
        }
        return this._instance;
    }
}
export default new Global();