import { useEffect, useState } from "react";
import { Toast, Alert, Button, Col, Container, Form, FormControl, ListGroup, ListGroupItem, Nav, Navbar, Row, Spinner, Table } from "react-bootstrap";
import { Link, Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import {PianoStudiButton, ErrorMessage, SubmitPiano, CancelPiano, DeletePiano, AddButton, RemoveButton} from "./Buttons"
import { IndovinelloForm } from './IndovinelloForm';
import API from './API';
import './App.css';
import { Risposte } from "./Risposte";
import { primaryColor, successColor, dangerColor, greyColor } from "./Constants"

function MyNavbar(props) {
    const navigate = useNavigate();

    return <>
      <Navbar style={{"backgroundColor": primaryColor, "padding": "0.3rem", "paddingRight": "1rem", "paddingLeft": "10%"}}>
        <Container fluid>
          <Nav>
            <Navbar.Brand href="/" style={{"color": "white", "paddingLeft": "10%"}} onClick={event => { event.preventDefault(); navigate("/"); }}>
                <i style={{"paddingRight":"20px", "fontSize": "1.5rem", "verticalAlign": "middle"}} class="bi bi-patch-question-fill"></i>
                App Indovinelli
            </Navbar.Brand> 
            {  
              props.username ? 
              <>
                <div className="verticalLine"></div>
                <Nav.Item style={{"paddingLeft": "1rem"}}>
                  <Nav.Link style={{"color": "white", "width": "200px"}} onClick={event => { event.preventDefault(); navigate("/myIndovinelli"); }}>My Indovinelli</Nav.Link>
                </Nav.Item>
              </> : null
            }  
          </Nav>

          <Nav style={{"color": "white", "paddingRight": "10%"}}>
            <Container>
              <Row>
                <Col md="auto">
                  {
                    props.username ? 
                      <div style={{"color": "white", "textAlign": "right"}}>
                        Welcome, {props.username}
                        <br/>
                        <a href="/logout" style={{"color": "white"}} onClick={event => {event.preventDefault(); props.logout();}}>Logout</a>
                      </div> : 
                      <div style={{"color": "white", "textAlign": "right"}}>
                      Welcome, Anonymous
                      <br/>
                      <a href="/login" style={{"color": "white"}} onClick={event => {event.preventDefault(); navigate("/login");}}>Login</a>
                      </div>
                  }
                </Col>
                <Col>
                  <h2>
                    <i className="bi bi-person-circle text-grey" style={{"color": "rgba(255, 255, 255, 0.9)", "verticalAlign": "middle"}}/>
                  </h2>
                </Col>
              </Row>
            </Container>
          </Nav>
        </Container>
      </Navbar>
      <Outlet/>
    </>;
}

function Timer(props){
  const [startTime, setStartTime] = useState(0);
  const [timer, setTimer] = useState("-");
  const [intervalId, setIntervalId] = useState(false);
  const [startCount, setStartCount] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(props.stato == "aperto"){
      API.fetchStartTime(props.id)
        .then( s => {
          if (s != "" && s != null){
            setStartTime(s);
            setStartCount(true);
          }
        })
        .catch(e => console.log(e));
    }
  }, [props.startTimer]);

  useEffect(() => {
    if (!startCount) return; 
    if (Math.floor(props.tempo - ((Date.now() - startTime)/1000)) > 0)
      setIntervalId(setInterval(() => {setTimer(Math.floor(props.tempo - ((Date.now() - startTime)/1000)));}, 1000));
  }, [startCount]);

  useEffect(() => {
    if (timer <= Math.floor(props.tempo/2))
      props.setShowSugg1(true);
    
    if (timer <= Math.floor(props.tempo/4))
      props.setShowSugg2(true);

    if (timer <= 0){
      clearInterval(intervalId);
      API.updateStato("chiuso", props.id)
        .then(() => {
          props.setRefetch(true);
          navigate("/visualizza/tempo"); 
        })
        .catch(e => console.log(e));
    }    
  }, [timer]);


  return (<>
    {
      props.stato == "aperto" ?
      <>{
        startCount ? 
        <b><div style={{"color": successColor}}>{timer}</div></b> :
        <div>{props.tempo}</div>
      }</> : 
      <div style={{"color": dangerColor}}>{props.tempo}</div>
    }
  </>)
}

function IndovinelloRow(props) {
    const navigate=useNavigate();
    const [answered, setAnswered] = useState(false);
    const location = useLocation().pathname;

    // check if user alredy submitterd answer to indovinello
    // props.user, rispotes di props.indovinello.id
    useEffect(() => {
      API.fetchRisposte(props.indovinello.id)
        .then(r => {
          if (r.find(risposta => risposta.user == props.user.id))
            setAnswered(true);
        })
        .catch(e => props.setErrors(e));
    }, []);

    return (<>
        <tr style={{"backgroundColor": "#ededed"}}>
          <td>
            {
              <Timer id={props.indovinello.id} stato={props.indovinello.stato} tempo={props.indovinello.tempo} setRefetch={props.setRefetch}/>
            }        
          </td>
          <td style={{"maxWidth": "380px", "word-wrap": "break-word"}}>
              <span>{props.indovinello.domanda}</span>
          </td>
          <td>
              <span>{props.indovinello.difficolta}</span>
          </td>
          <td>
              <i>{
                props.indovinello.stato == "aperto" ? 
                <span style={{"color" : successColor}}>{props.indovinello.stato}</span> : 
                <span style={{"color" : dangerColor}}>{props.indovinello.stato}</span>
              }</i>
          </td>
          { props.loggedIn ?
            <td style={{"textAlign":"right"}}>
              {
                location == "/" ? (
                props.indovinello.user != props.user.id ? (
                  props.indovinello.stato == "aperto" ? 
                  (
                    answered ? <Button onClick={() => {}} style={{"marginRight": "10px", "backgroundColor": greyColor, "borderColor": greyColor}}>Answered</Button>
                    : <Button onClick={() => {navigate(`/rispondi/${props.indovinello.id}`);}} style={{"marginRight": "10px", "backgroundColor": successColor, "borderColor": successColor}}>Rispondi</Button>
                  ) : 
                  <Button onClick={() => navigate(`/visualizza/${props.indovinello.id}`)} style={{"marginRight": "10px", "backgroundColor": dangerColor, "borderColor": dangerColor}}>Visualizza</Button>
                ) : <Button onClick={() => navigate(`/myIndovinelli`)} style={{"marginRight": "10px", "backgroundColor": primaryColor, "borderColor": primaryColor}}>See Mines</Button>
                ) : <Button onClick={() => navigate(`/visualizza/${props.indovinello.id}`)} style={{"marginRight": "10px", "backgroundColor": dangerColor, "borderColor": dangerColor}}>Visualizza</Button>
              }
            </td> : null
          }
        </tr>
    </>);
}

function IndovinelliTable(props) {
  return (
    <Table style={{"border": "1px solid #a3a3a3", "fontSize": "0.9rem"}}>
      <tbody>
        <tr style={{"backgroundColor": primaryColor, "color": "white"}}>
            <th>Tempo</th>
            <th>Domanda</th>
            <th>Difficoltà</th>
            <th>Stato</th>
            { props.loggedIn ? <th></th> : null }
        </tr>
        {
          props.indovinelli.map(i => <IndovinelloRow user={props.user} loggedIn={props.loggedIn} indovinello={i} setRefetch={props.setRefetch}/>)
        }
      </tbody>
    </Table>
  );
}

function TopTable(props) {
  return (
    <Table style={{"border": "1px solid #a3a3a3", "fontSize": "0.9rem"}}>
      <tbody>
        <tr style={{"backgroundColor": primaryColor, "color": "white"}}>
            <th>Nome</th>
            <th>Punti</th>
        </tr>
        <tr style={{"backgroundColor": "#ededed"}}>
          <td><span>{props.users[0].nome}</span></td>
          <td><span>{props.users[0].punti}</span></td>
        </tr>
        <tr style={{"backgroundColor": "#ededed"}}>
          <td><span>{props.users[1].nome}</span></td>
          <td><span>{props.users[1].punti}</span></td>
        </tr>
        <tr style={{"backgroundColor": "#ededed"}}>
          <td><span>{props.users[2].nome}</span></td>
          <td><span>{props.users[2].punti}</span></td>
        </tr>
      </tbody>
    </Table>
  );
}

function Page(props) {
  return (<>
    {
    props.ready ? 
    <Container fluid style={{"paddingTop": "20px"}}>
      <Row className="justify-content-md-center" style={{"minHeight": "100vh"}}>
        <Col className="col-6" style={{"paddingTop": "1rem", "paddingRight": "2rem"}}>
          <p><b style={{"fontSize": "1.3rem", "color": primaryColor}}>Indovinelli</b></p>
          <IndovinelliTable user={props.user} loggedIn={props.loggedIn} indovinelli={props.indovinelli} setRefetch={props.setRefetch}/>
        </Col>
        <Col className="col-4" style={{"paddingTop": "1rem", "paddingLeft": "2rem"}}>
          <Row style={{"margin": "0"}}>
            <Col>
              <p style={{"color": primaryColor, "fontSize": "1rem"}}><b style={{"fontSize": "1.3rem"}}>Top 3 Users</b></p> 
            </Col>
          </Row>
          <TopTable users={props.users}/>
        </Col>
      </Row>
    </Container> : null
    }
  </>)
}

function MyIndovinelli(props) {
  const indovinelli = props.indovinelli.filter(i => i.user == props.user.id);

  return (
    <Container fluid style={{"paddingTop": "20px"}}>
      <Row className="justify-content-md-center" style={{"minHeight": "100vh"}}>
        <Col className="col-6" style={{"paddingTop": "1rem", "paddingRight": "5rem"}}>
          <p><b style={{"fontSize": "1.3rem", "color": primaryColor}}>Indovinelli</b></p>
          <IndovinelliTable user={props.user} loggedIn={props.loggedIn} indovinelli={indovinelli}/>
        </Col>
        <Col className="col-4" style={{"paddingTop": "1rem", "paddingLeft": "2rem"}}>
          <IndovinelloForm user={props.user} addIndovinello={props.addIndovinello} />
        </Col>
      </Row>
    </Container>
  )
}


function Visualizza(props) {
  const navigate = useNavigate();
  const [risposte, setRisposte] = useState([]);
  const [ready, setReady] = useState(false);
  const [indovinello, setIndovinello] = useState(false);

  useEffect(() => {
    if (props.indovinelli.length == 0) return;

    if (!props.indovinelli.find(i => i.id == idIndovinello))
      navigate("*");
    setIndovinello(props.indovinelli.find(i => i.id == idIndovinello));

    API.fetchRisposte(idIndovinello)
      .then(r => {
        setRisposte(r);
        setReady(true);
      })
      .catch(e => props.setErrors(e));
  }, [props.indovinelli]);

  const idIndovinello = useParams().idIndovinello;

  return (<>
    {
    ready ? 
    <Container fluid style={{"paddingTop": "20px"}}>
      <Row className="justify-content-md-center" style={{"minHeight": "100vh"}}>
        <Col className="col-4" style={{"paddingTop": "1rem", "paddingRight": "2rem"}}>
          <Button onClick={() => navigate(-1)} style={{"backgroundColor": primaryColor, "borderColor": primaryColor}}>Back</Button>
          <div style={{"backgroundColor": "#f0f0f0", "padding": "1.5rem", "marginTop": "1rem", "border": "2px solid #bdbdbd", "borderRadius": "10px"}}>
            <p>Domanda: <b>{indovinello.domanda}</b></p>
            <p>Soluzione: <b>{indovinello.soluzione}</b></p>
            <p>Stato:&nbsp;
              <b><i>{
                indovinello.stato == "aperto" ? 
                <span style={{"color" : successColor}}>{indovinello.stato}</span> : 
                <span style={{"color" : dangerColor}}>{indovinello.stato}</span>
              }</i></b>
            </p>
            {
              risposte.find(r => r.risposta == indovinello.soluzione) ? 
              <p>Vincitore: <b>{props.users.find(u => u.id == risposte.find(r => r.risposta == indovinello.soluzione).user).nome}</b></p> :
              (
                indovinello.stato == "chiuso" ?
                <p><b>Nessun Vincitore, tempo scaduto</b></p> :
                <p><Row>
                  <Col className="col-sm-auto"style={{"paddingRight": "0px"}}><div>Indovinello aperto - tempo rimanente: </div></Col>
                  <Col><Timer id={indovinello.id} stato={indovinello.stato} tempo={indovinello.tempo} setRefetch={props.setRefetch}/></Col>
                </Row></p>
              )
            }
            <p><b>Risposte:</b> {risposte.map(r => (<div>&emsp;&emsp;{props.users.find(u => u.id == r.user).nome}: <i>{r.risposta}</i></div>))}</p>
          </div>
        </Col>
      </Row>
    </Container> : null
    }
  </>)
}

function Rispondi(props) {
  const navigate = useNavigate();
  const [risposta, setRisposta] = useState(null);
  const [showSugg1, setShowSugg1] = useState(false);
  const [showSugg2, setShowSugg2] = useState(false);

  const idIndovinello = useParams().idIndovinello
  if (!props.indovinelli.find(i => i.id == idIndovinello))
    return <NotFoundPage/>
  const indovinello = props.indovinelli.find(i => i.id == idIndovinello);
  let punti;
  switch (indovinello.difficolta) {
    case "facile":
      punti = 1;
      break;
    case "medio":
      punti = 2;
      break;
    case "difficile":
      punti = 3;
      break;
  }

  const handleSubmit = event => {
    event.preventDefault();
    
    if (risposta == null) setRisposta("");
    if (risposta != null && risposta != "") {
      const r = new Risposte(1, idIndovinello, risposta);
      // submit risposta
      API.submitRisposta(r)
        .then(() => {
          // if correct
          if (risposta == indovinello.soluzione){
            // if correct change stato to closed
            API.updateStato("chiuso", indovinello.id)
              .then(() => {
                  // add points to winner
                  API.updatePoints(punti)
                  .then(() => {
                    props.setRefetch(true)
                  })
                  .catch(e => props.setErrors(e))
              })
              .catch(e => props.setErrors(e));
            navigate("/risultato/corretto");
          }  
          // if wrong, put start time
          else {
            if(indovinello.startTime==null || indovinello.startTime==""){
              API.updateStartTime(Date.now(), indovinello.id)
              .then(() => {
                props.setRefetch(true)
              })
              .catch(e => props.setErrors(e))
            }
            navigate("/risultato/errato");
          }
        })
        .catch(e => props.setErrors(e));
    } 
  }
  
  return (<>
    {
    <Container fluid style={{"paddingTop": "20px"}}>
      <Row className="justify-content-md-center" style={{"minHeight": "100vh"}}>
        <Col className="col-4" style={{"paddingTop": "1rem", "paddingRight": "2rem"}}>
          <Button onClick={() => navigate(-1)} style={{"backgroundColor": primaryColor, "borderColor": primaryColor}}>Back</Button>
          <div style={{"backgroundColor": "#f0f0f0", "padding": "1.5rem", "marginTop": "1rem", "border": "2px solid #bdbdbd", "borderRadius": "10px"}}>
            <p>Domanda: <b>{indovinello.domanda}</b></p>
            <p><Row>
              <Col className="col-sm-auto"style={{"paddingRight": "0px"}}><div>Tempo: </div></Col>
              <Col><Timer id={indovinello.id} stato={indovinello.stato} tempo={indovinello.tempo} setShowSugg1={setShowSugg1}
               setShowSugg2={setShowSugg2} setRefetch={props.setRefetch}/></Col>
            </Row></p>
            <p>Suggerimento 1: {showSugg1 ? <b>{indovinello.sugg1}</b> : <i>hidden</i>}</p>
            <p>Suggerimento 2: {showSugg2 ? <b>{indovinello.sugg2}</b> : <i>hidden</i>}</p>
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Risposta:</Form.Label>
                  <Form.Control isInvalid={risposta==""}
                                type="text"
                                placeholder=""
                                onChange={event => {setRisposta((event.target.value).toLowerCase());}}/>
                  <Form.Control.Feedback type="invalid">
                    Risposta non può essere vuota
                  </Form.Control.Feedback>
                </Form.Group>
              <Button type="submit" style={{"marginTop": "12px", "backgroundColor": primaryColor, "borderColor": primaryColor}}>Submit</Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
    }
  </>)
}

function Risultato(props) {
  const navigate = useNavigate();

  const stato = useParams().stato
  if (!(stato == "corretto" || stato == "errato" || stato == "tempo"))
    return <NotFoundPage/>

  return (<Container fluid style={{"paddingTop": "20px"}}>
      <Row className="justify-content-md-center" style={{"minHeight": "100vh"}}>
        <Col className="col-3" style={{"paddingTop": "1rem", "paddingRight": "2rem"}}>
          <div style={{"backgroundColor": "#f0f0f0", "padding": "1.5rem", "marginBottom": "1rem", "marginTop": "1rem", "border": "2px solid #bdbdbd", "borderRadius": "10px"}}>
            {stato == "corretto" ? <>Risposta corretta!</> : (
              stato == "tempo" ? <>tempo scaduto</> : <>Risposta errata</>
            )}
          </div>
          <Button onClick={() => navigate("/")} >Home</Button>
        </Col>
      </Row>
    </Container>)
}
  
function NotFoundPage() {
    return <>
      <div style={{"textAlign": "center", "paddingTop": "5rem"}}>
        <h1>
          <i className="bi bi-exclamation-circle-fill"/>
          {" "}
          The page cannot be found
          {" "}
          <i className="bi bi-exclamation-circle-fill"/>
        </h1>
        <br/>
        <p>
          The requested page does not exist, please head back to the <Link to={"/"}>app</Link>.
        </p>
      </div>
    </>;
}

function NetErrors(props) {
    return <Alert variant="danger" style={{"margin": "2rem"}}>
      Encountered the following error(s), please retry later:
      <br/>
      <ul>
      {
        props.errors.map((e, i) => <li key={i + ""}>{e}</li>)
      }
      </ul>
    </Alert>;
}


export {MyNavbar, Page, NotFoundPage, NetErrors, MyIndovinelli, Visualizza, Rispondi, Risultato}; 