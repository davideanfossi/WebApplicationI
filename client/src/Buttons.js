import { useEffect, useState } from "react";
import { Toast, Alert, Button, Col, Container, Form, FormControl, ListGroup, ListGroupItem, Nav, Navbar, Row, Spinner, Table } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
//import API from "./API";

/*
function PianoStudiButton(props) {
    const [show, setShow] = useState(false);

    function createTime(time){
      API.submitNewTime(time)
      .then((time) => {})
      .catch(e => props.setErrors(e));

      props.setTime(time)
    }
  
    if (props.time) {
      return (
        <Link to={"/piano"} style={{"cursor":"pointer", "textDecoration": "none", "position": "fixed", "bottom": "1.5rem", "right": "1.5rem", "fontSize": "2.5rem", "color": "white"}}>
          <div style = {{"backgroundColor": "#0d6efd", "display": 'flex', "justifyContent": 'center', "alignItems": 'center', "paddingLeft": "20px", "paddingRight": "10px", "borderRadius": 10}}>
            <span style={{"fontSize": "1.3rem"}}> Modifica piano studi </span> 
            <i class="bi bi-plus"></i>
          </div>
        </Link>
      );
    } else {
      return (
        <>
          {
            show ?
            <>
              <Link to={"/piano"} onClick={() => createTime("full-time")} style={{"cursor":"pointer", "textDecoration": "none", "position": "fixed", "bottom": "6rem", "right": "1.5rem", "fontSize": "2rem", "color": "white"}}>
                <div style = {{"backgroundColor": "#0d6efd", "display": 'flex', "justifyContent": 'center', "alignItems": 'center', "paddingLeft": "20px", "paddingRight": "10px", "borderRadius": 10}}>
                  <span style={{"fontSize": "1.1rem"}}> Piano full-time </span> 
                  <i class="bi bi-plus"></i>
                </div>
              </Link>
              <Link to={"/piano"} onClick={() => createTime("part-time")} style={{"cursor":"pointer", "textDecoration": "none", "position": "fixed", "bottom": "9.5rem", "right": "1.5rem", "fontSize": "2rem", "color": "white"}}>
              <div style = {{"backgroundColor": "#0d6efd", "display": 'flex', "justifyContent": 'center', "alignItems": 'center', "paddingLeft": "20px", "paddingRight": "10px", "borderRadius": 10}}>
                <span style={{"fontSize": "1.1rem"}}> Piano part-time </span> 
                <i class="bi bi-plus"></i>
              </div>
              </Link>
            </>
            : null
          }
          
          <div onClick={() => setShow(!show)} state={props.currentFilter} style={{"cursor":"pointer", "textDecoration": "none", "position": "fixed", "bottom": "1.5rem", "right": "1.5rem", "fontSize": "2.5rem", "color": "white"}}>
            <div style = {{"backgroundColor": "#0d6efd", "display": 'flex', "justifyContent": 'center', "alignItems": 'center', "paddingLeft": "20px", "paddingRight": "10px", "borderRadius": 10}}>
              <span style={{"fontSize": "1.3rem"}}> Crea piano studi </span> 
              <i class="bi bi-plus"></i>
            </div>
          </div>
        </>
      );
    }
    
}
  
function ErrorMessage(props) {
return (
    <Toast onClose={() => props.errorSetter(false)} style={{"width": "50%", "position": "fixed", "top": "5%", "left": "25%"}} delay={3000} autohide>
    <Toast.Header style={{"color": "white", "backgroundColor":"rgba(255, 0, 0, 0.7)"}}>
        <strong className="me-auto">Error!</strong>
    </Toast.Header>
    <Toast.Body style={{"color": "white", "backgroundColor":"rgba(255, 91, 79, 0.7)"}}>{props.errorText}</Toast.Body>
    </Toast>
);
}

function SubmitPiano(props) {
  const navigate = useNavigate();

  function submit() {
      if (props.time == "full-time"){
      if (props.crediti < 60){
          props.setSaveCreditError(true);
          return;
      }  
      } else {
      if (props.crediti < 20){
          props.setSaveCreditError(true);
          return;
      }  
      }
      
      API.submitNewPiano(props.piano)
      .then(() => props.setRefetchPiano(true))
      .catch(e => props.setErrors(e));

      navigate("/");
  }

  return (
      <div onClick={() => submit()} style={{"cursor":"pointer", "textDecoration": "none", "position": "fixed", "bottom": "1.5rem", "right": "21.1rem", "fontSize": "1.7rem", "color": "white"}}>
      <div style = {{"height": "45px", "backgroundColor": "#ff4d4d", "display": 'flex', "justifyContent": 'center', "alignItems": 'center', "paddingLeft": "20px", "paddingRight": "10px", "borderRadius": 10}}>
          <span style={{"fontSize": "1.2rem"}}>Salva </span> 
          <i class="bi bi-check-lg"></i>
      </div>
      </div>
  );
}

function CancelPiano(props) {
  const navigate = useNavigate();

  function cancel() {
    // reload server version

    // if pianio vuuto metti full-time to ""
    API.fetchPiano()
    .then((piano) => {
      if (piano.length == 0) {
        API.submitNewTime("")
        .then(() => props.setRefetchPiano(true))
        .catch(e => props.setErrors(e));
      } else {
        props.setRefetchPiano(true);
      }
    })
    .catch(e => props.setErrors(e));
  
    
    
    navigate("/");
  }

  return (
      <div onClick={() => cancel()} style={{"cursor":"pointer", "textDecoration": "none", "position": "fixed", "bottom": "1.5rem", "right": "12.5rem", "fontSize": "2.1rem", "color": "white"}}>
      <div style = {{"height": "45px", "backgroundColor": "#ff4d4d", "display": 'flex', "justifyContent": 'center', "alignItems": 'center', "paddingLeft": "20px", "paddingRight": "10px", "borderRadius": 10}}>
          <span style={{"fontSize": "1.2rem"}}>Annulla </span> 
          <i class="bi bi-x"></i>
      </div>
      </div>
  )
}

function DeletePiano(props){
  const navigate = useNavigate();

  function deletePiano() {
      API.deletePiano()
      .then(() => {})
      .catch(e => props.setErrors(e));

      API.submitNewTime("")
      .then(() => props.setRefetchPiano(true))
      .catch(e => props.setErrors(e));

      navigate("/");
  }

  return (
      <div onClick={() => deletePiano()} style={{"cursor":"pointer", "textDecoration": "none", "position": "fixed", "bottom": "1.5rem", "right": "1.5rem", "fontSize": "1.35rem", "color": "white"}}>
      <div style = {{"height": "45px", "backgroundColor": "#ff4d4d", "display": 'flex', "justifyContent": 'center', "alignItems": 'center', "paddingLeft": "20px", "paddingRight": "10px", "borderRadius": 10}}>
          <span style={{"fontSize": "1.2rem"}}>Cancella tutti </span> 
          <i class="bi bi-trash3" style={{"paddingLeft": "5px"}}></i>
      </div>
      </div>
  );
}

function AddButton(props) {
  const buttonStyle = props.corso.addable ? {"cursor":"pointer", "fontSize": "1.6rem", "color": "#ff4d4d"} : {"cursor":"pointer", "fontSize": "1.6rem", "color": "#0d6efd"};
  return (
      <>{ 
      props.flag==1 ? 
          <td style={{"paddingLeft": "2rem", "paddingRight": "1rem"}}>
          <i onClick={(e) => {e.stopPropagation(); props.addCorso(props.corso);} } style={buttonStyle} class="bi bi-plus-circle-fill"></i>
          </td> : null
      }</>
  )
}

function RemoveButton(props) {
  return (
      <>{
      props.flag==2 ? 
          <td style={{"paddingLeft": "2rem", "paddingRight": "1rem"}}>
          <i onClick={(e) => {e.stopPropagation(); props.removeCorso(props.corso);}} style={{"cursor":"pointer", "fontSize": "1.6rem", "color": "#ff4d4d"}} class="bi bi-dash-circle-fill"></i>
          </td> : null
      }</>
  )
}

export {PianoStudiButton, ErrorMessage, SubmitPiano, CancelPiano, DeletePiano, AddButton, RemoveButton}

*/