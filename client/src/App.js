import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { MyNavbar, NetErrors, NotFoundPage, Page, MyIndovinelli, Visualizza, Rispondi, Risultato } from './Components';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Indovinello } from './Indovinello';
import API from './API';
import { LoginForm } from './LoginForm';

function App() {
  return <Router>
    <Main/>
  </Router>;
}

function Main() {
  const [indovinelli, setIndovinelli] = useState([]);
  const [users, setUsers] = useState([]);
  const [ready, setReady] = useState(false);

  const [refetch, setRefetch] = useState(false);

  const [loggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    API.getUser()
      .then(u => {
        setLoggedIn(true);
        setUser(u);
        setRefetch(true);
      })
      .catch(e => {
        setRefetch(true);
        setErrorsChecked(e)}
      );
  }, []);

  useEffect(() => {
    if (!refetch) return;

    API.fetchIndovinelli()
      .then(indovinelli => {
        setIndovinelli(indovinelli);    
        API.fetchUsers()
        .then(u => {
          u.sort((b,a) => (a.punti > b.punti) ? 1 : ((b.punti > a.punti) ? -1 : 0));
          setUsers(u);
          setReady(true);
        })
        .catch(e => {
          setErrors(e)
        });
      })
      .catch(e => {
        setErrors(e)
      });
    
    setRefetch(false); 
  }, [refetch]); 

  const setErrorsChecked = e => {
    if (e.includes("Not authenticated")) {
      setLoggedIn(false);
      setUser({});
    } else setErrors(e);
  };

  const addIndovinello = (indovinello) => {
    setIndovinelli(indovinelli => [...indovinelli, indovinello]);

    API.submitIndovinello(indovinello)
      .then(() => setRefetch(true))
      .catch(e => setErrors(e))
  }

/*
  const addCorso = (corso) => {
    // re-compute checks
    computeAddables(); 
    // checks
    let c = corsi.find(c => c.codice == corso.codice);
    if (c.addable) {
      setGenericError(c.addable);
      return;
    }

    // controllo crediti
    if (time == "full-time"){
      if (crediti + corso.crediti > 80){
        setGenericError("Numero massimo di crediti superato");
        return;
      }
    } else {
      if (crediti + corso.crediti > 40){
        setGenericError("Numero massimo di crediti superato");
        return;
      }
    }

    // aggiungi
    setCrediti(c => c + corso.crediti);
    setPiano(piano => [...piano, corso]);

    // re-compute checks
    //computeAddables();  
  };

  const removeCorso = (corso) => {
    // controllo vincolo di propedeuticità
    for (let i=0; i<piano.length; i++) {
      if (corso.codice == piano[i].proped){
        setPropedRemoveError(piano[i].codice + " - " + piano[i].nome);
        return;
      }
    }

    // remove
    setCrediti(c => c - corso.crediti);
    setPiano(piano => piano.filter(p => p.codice != corso.codice));

    // re-compute checks
    computeAddables();
  };

*/

  const login = (email, password) => {
    return API.login(email, password)
      .then(u => {
        setLoggedIn(true);
        setUser(u);
        setRefetch(true);
        navigate("/");
      });
  };

  const logout = () => {
    API.logout()
      .then(() => {
        setUser({});
        setLoggedIn(false);
      })
      .catch(e => setErrors(e));
  };
  
  const mainPage = errors.length ? <NetErrors errors={errors}/> : <Page
    indovinelli={indovinelli}
    user={user}
    users={users}
    loggedIn={loggedIn}
    ready={ready}
    setRefetch={setRefetch}
  />;
  
  return <Routes>   
    <Route path="/login" element={<LoginForm login={login} />}/>   
    <Route path="/" element={<MyNavbar username={user.name} logout={logout}/>}>
        <Route path="" element={mainPage}/>
        <Route path="myIndovinelli" element={loggedIn ? <MyIndovinelli loggedIn={loggedIn} indovinelli={indovinelli} user={user} addIndovinello={addIndovinello}/> : <Navigate to="/"/> }/>
        <Route path="visualizza/:idIndovinello" element={loggedIn ? <Visualizza indovinelli={indovinelli} users={users} setErrors={setErrors}/> : <Navigate to="/"/>}/>
        <Route path="rispondi/:idIndovinello" element={loggedIn ? <Rispondi indovinelli={indovinelli} users={users} setErrors={setErrors} setRefetch={setRefetch}/> : <Navigate to="/"/>}/>
        <Route path="risultato/:stato" element={<Risultato/>}/>
    </Route>
    {/* Catch all page for invalid routes */}
    <Route path="*" element={<NotFoundPage/>}/>
  </Routes>;
}

export default App;
