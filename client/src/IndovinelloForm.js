import { useState } from "react";
import { Button, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import { Indovinello } from "./Indovinello";
import { primaryColor, successColor, dangerColor, greyColor } from "./Constants"

function IndovinelloForm(props) {
    // Form state
    const [domanda, setDomanda] = useState(null);
    const [soluzione, setSoluzione] = useState(null);
    const [sugg1, setSugg1] = useState(null);
    const [sugg2, setSugg2] = useState(null);
    const [tempo, setTempo] = useState(null);
    const [difficolta, setDifficolta] = useState("facile");
  
    const handleSubmit = event => {
      event.preventDefault();
  
      //for errors display  
      if (domanda==null) setDomanda("");
      if (soluzione==null) setSoluzione("");
      if (sugg1==null) setSugg1("");
      if (sugg2==null) setSugg2("");
      if (tempo==null || !(parseInt(tempo)<=600 && parseInt(tempo)>=30)) setTempo("");
  
      // check data correct
      if (domanda!="" && soluzione!="" && sugg1!="" && sugg2!="" && tempo!="" 
      && domanda!=null && soluzione!=null && sugg1!=null && sugg2!=null && tempo!=null
      && (parseInt(tempo)<=600 && parseInt(tempo)>=30)) {
        const submittedIndovinello = new Indovinello(props.user.id, domanda, soluzione, sugg1, sugg2, difficolta, tempo, "aperto");
  
        props.addIndovinello(submittedIndovinello);
      }
    };
  
    return (
      <Container fluid style={{"padding": "0"}}>
        <Row style={{"paddingLeft": "0.7rem"}}>
            <b style={{"fontSize": "1.3rem", "color": primaryColor, "paddingBottom": "0.6rem"}}>Crea Indovinello</b>
        </Row>
        <Container className="border border-4 rounded" style={{"marginTop": "0.5rem", "padding": "1rem"}}>
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label>Domanda</Form.Label>
                <Form.Control isInvalid={domanda==""}
                              type="text"
                              placeholder="Domanda"
                              onChange={event => {setDomanda(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Domanda non può essere vuota
                </Form.Control.Feedback>
              </Form.Group>
  
              <Form.Group style={{"paddingTop": "12px"}}>
                <Form.Label>Soluzione</Form.Label>
                <Form.Control isInvalid={soluzione==""}
                              type="text"
                              placeholder="Soluzione"
                              onChange={event => {setSoluzione(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Soluzione non può essere vuota
                </Form.Control.Feedback>
              </Form.Group>
  
              <Form.Group as={Col} md="6" style={{"paddingTop": "12px"}}>
                <Form.Label>Suggerimento 1</Form.Label>
                <Form.Control isInvalid={sugg1==""}
                              type="text"
                              placeholder="Suggerimento 1"
                              onChange={event => {setSugg1(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Suggerimento non può essere vuoto
                </Form.Control.Feedback>
              </Form.Group>
  
              <Form.Group as={Col} md="6" style={{"paddingTop": "12px"}}>
                <Form.Label>Suggerimento 2</Form.Label>
                <Form.Control isInvalid={sugg2==""}
                              type="text"
                              placeholder="Suggerimento 2"
                              onChange={event => {setSugg2(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Suggerimento non può essere vuoto
                </Form.Control.Feedback>
              </Form.Group>
  
              <Form.Group as={Col} md="4" style={{"paddingTop": "12px"}}>
                <Form.Label>Tempo</Form.Label>
                <Form.Control isInvalid={tempo==""}
                              type="text"
                              placeholder="30 - 600"
                              onChange={event => {setTempo(event.target.value);}}/>
                <Form.Control.Feedback type="invalid">
                  Tempo deve essere numero compreso tra 30 e 600
                </Form.Control.Feedback>
              </Form.Group>
  
              <Form.Group as={Col} md="8" style={{"paddingTop": "12px"}}>
                <Form.Label>Difficoltà</Form.Label><br></br>
                <div style={{"paddingTop": "8px"}}>
                  <Form.Check inline defaultChecked  type="radio" name="difficolta" label="facile" onChange={() => setDifficolta("facile")}/>
                  <Form.Check inline type="radio" name="difficolta" label="medio" onChange={() => setDifficolta("medio")}/>
                  <Form.Check inline type="radio" name="difficolta" label="difficile" onChange={() => setDifficolta("difficile")}/>
                </div>      
              </Form.Group>
  
            </Row>
            <Button type="submit"  style={{"marginTop": "12px", "backgroundColor": primaryColor, "borderColor": primaryColor}}>Submit</Button>
          </Form>
        </Container>
      </Container>
    );
}

export { IndovinelloForm };