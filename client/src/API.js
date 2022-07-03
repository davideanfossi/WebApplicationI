import { Indovinello } from './Indovinello';
import { Risposte } from './Risposte';

const SERVER_HOST = "http://localhost";
const SERVER_PORT = 3001;

const SERVER_BASE = `${SERVER_HOST}:${SERVER_PORT}/api/`;


const fetchIndovinelli = async () => {
  let errors = [];
  
  try {
    const response = await fetch(new URL("indovinelli", SERVER_BASE), {
      credentials: "include"
    });
    const msg = await response.json();
    
    if (response.ok) {
      return msg.map(i => new Indovinello(
        i.ID,
        i.DOMANDA,
        i.SOLUZIONE,
        i.SUGG1,
        i.SUGG2,
        i.DIFFICOLTA,
        i.TEMPO,
        i.STATO,
        i.USER
      ));
    } else errors = msg.errors;
  } catch (e) {
    const err = [e.message];
    throw err;
  }

  if (errors.length !== 0)
    throw errors;
};

const fetchRisposte = async (id) => {
  let errors = [];
  
  try {
    const response = await fetch(new URL("risposte/" + id, SERVER_BASE), {
      credentials: "include"
    });
    const msg = await response.json();
    
    if (response.ok) {
      return msg.map(r => new Risposte(
        r.ID,
        r.INDOVINELLO,
        r.RISPOSTA,
        r.USER
      ));
    } else errors = msg.errors;
  } catch (e) {
    const err = [e.message];
    throw err;
  }

  if (errors.length !== 0)
    throw errors;
};

const fetchUsers = async () => {
    let errors = [];
    
    try {
      const response = await fetch(new URL("users", SERVER_BASE), {
        credentials: "include"
      });
      const msg = await response.json();
      if (response.ok) {
        let a = msg.map(u => {return {id: u.ID, nome: u.NOME, punti: u.PUNTI}});
        return a;
      } else errors = msg.errors;
    } catch (e) {
      const err = [e.message];
      throw err;
    }
  
    if (errors.length !== 0)
      throw errors;
};

const submitIndovinello = async indovinello => {
  let errors = [];
  
  try {
    const response = await fetch(
      new URL("indovinello", SERVER_BASE), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(indovinello),
        credentials: "include"
      }
    );

    if (response.ok) {
      return;
    } else errors = (await response.json()).errors;
  } catch (e) {
    // Map error
    const err = [e.message];
    throw err;
  }

  if (errors.length !== 0)
    throw errors;
};

const submitRisposta = async risposta => {
  let errors = [];
  
  try {
    const response = await fetch(
      new URL("risposta", SERVER_BASE), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(risposta),
        credentials: "include"
      }
    );

    if (response.ok) {
      return;
    } else errors = (await response.json()).errors;
  } catch (e) {
    // Map error
    const err = [e.message];
    throw err;
  }

  if (errors.length !== 0)
    throw errors;
};

const updateStato = async (s, id) => {
  let errors = [];
  
  try {
    const response = await fetch(
      new URL("stato/" + id, SERVER_BASE), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({stato: s}),
        credentials: "include"
      }
    );
    
    if (response.ok) {
      return;
    } else errors = (await response.json()).errors;
  } catch (e) {
    const err = [e.message];
    throw err;
  }

  if (errors.length !== 0)
    throw errors;
};

const updatePoints = async (p) => {
  let errors = [];
  
  try {
    const response = await fetch(
      new URL("points", SERVER_BASE), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({punti: p}),
        credentials: "include"
      }
    );
    
    if (response.ok) {
      return;
    } else errors = (await response.json()).errors;
  } catch (e) {
    const err = [e.message];
    throw err;
  }

  if (errors.length !== 0)
    throw errors;
};

const login = async (email, password) => {
  let errors = [];
  
  try {
    const response = await fetch(
      new URL("login", SERVER_BASE), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username: email, password}),
        credentials: "include"
      }
    );
    const msg = await response.json();
    
    if (response.ok) return msg;
    else errors = msg.errors;
  } catch (e) {
    const err = [e.message];
    throw err;
  }

  if (errors.length !== 0)
    throw errors;
};

const logout = async () => {
  let errors = [];
  
  try {
    const response = await fetch(
      new URL("session", SERVER_BASE), {
        method: "DELETE",
        credentials: "include"
      }
    );

    if (!response.ok) {
      errors = (await response.json()).errors;
    }
  } catch (e) {
    const err = [e.message];
    throw err;
  }

  if (errors.length !== 0)
    throw errors;
};

/// Get the current user's info.
/// This is useful to allow the app to survive refreshes without having to login again
const getUser = async () => {
  let errors = [];
  
  try {
    const response = await fetch(
      new URL("user", SERVER_BASE), {
        credentials: "include"
      }
    );
    const msg = await response.json();
    
    if (response.ok) return msg;
    else errors = msg.errors;
  } catch (e) {
    const err = [e.message];
    throw err;
  }

  if (errors.length !== 0)
    throw errors;
};


const API = {
  fetchIndovinelli,
  fetchUsers,
  fetchRisposte,
  submitIndovinello,
  submitRisposta,
  updateStato,
  updatePoints,
  login,
  logout,
  getUser
};

export default API;
