import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      session:[],
      sessions: [],
      contacts:[],
      user:{},
      receiver:null,
      contact:null,
      contactUnread:false,
    },
    mutations: {
      setContactUnread(state,unread){
        state.contactUnread = unread;
      },
      setSessions(state,sessions){
        state.sessions = sessions;
      },
      addSession(state,session){
        let flag = true;
        for(var i=0;i<state.sessions.length;i++){
          if(state.sessions[i].userId === session.userId){
            flag = false;
            break;
          }
        }
        if(flag){
          state.sessions.unshift(session);  
        }
      },
      setContacts(state,contacts){
        state.contacts = contacts;
      },
      setContact(state,contact){
        state.contact = contact;
      },
      setSession (state,session) {
        state.session = session;
      },
      addMessage(state,session) {
        state.session.push(session);
      },
      setUser(state,user){
        state.user = user;
      },
      setReceiver(state,receiver){
        state.receiver = receiver;
      },
    },
    getters: {
      getContactUnread: state => {
        return state.contactUnread;
      },
      getSessions: state => {
        return state.sessions;
      },
      getContacts: state => {
        return state.contacts;
      },
      getContact: state => {
        return state.contact;
      },
      getSession: state => {
        return state.session;
      },
      getUser: state => {
        return state.user;
      },
      getReceivert: state => {
        return state.receiver;
      }
    }
  })