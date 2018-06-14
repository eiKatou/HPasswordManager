class SessionStore {
  constructor(){
    this._data = [];
  }

  add(name, data){
    this._data.push({name, data});
  }

  get(name){
    return this._data.find(d => d.name === name).data;
  }
}

const sessionStoreInstance = new SessionStore();
// export default sessionStoreInstance;
module.exports = sessionStoreInstance;