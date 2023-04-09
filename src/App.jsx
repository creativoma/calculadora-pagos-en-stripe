// Dependencias
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

// Variables
const inputAnchoMedio = "w-[calc(50%-10px)]";
const inputAncho = "w-full";
const soloLectura = "bg-blue-50";
const soloLectura2 = "bg-green-100";

// Funciones
function reemplazarComa(valor) {
  // Redondeamos a 2 decimales
  let num = Math.round(valor * 100) / 100;
  // Convertimos a string
  num = num.toString();
  // Reemplazamos la coma por un punto
  num = num.replace(".", ",");
  return num;
}

function App() {
  const [cotizacion, setCotizacion] = useState("Cargando...");
  const [fetchCompletado, setFetchCompleto] = useState(false);
  const [cotizacion2, setCotizacion2] = useState("Cargando...");
  const [fetchCompletado2, setFetchCompleto2] = useState(false);

  const [input1, setInput1] = useState(0);
  const [input2, setInput2] = useState(0);
  const [input3, setInput3] = useState(0);
  const [input4, setInput4] = useState(0);
  const [input5, setInput5] = useState(0);
  const [input6, setInput6] = useState(0);

  useEffect(() => {
    fetch("https://decoancasti.com/api/cotizacion-eur-usd/index.php")
      // Recuperamos la respuesta que ya viene en formato JSON
      .then((response) => response.json())
      // Recuperamos los datos de la respuesta
      .then((data) => {
        setCotizacion(data.EUR_to_USD);
        setFetchCompleto(true);
      });

      fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales")
      // Recuperamos la respuesta que ya viene en formato JSON
      .then((response) => response.json())
      // Recuperamos los datos de la respuesta
      .then((data2) => {
        let string = data2[0].casa.venta;
        string = string.replace(",", ".");
        let number = parseFloat(string);
        setCotizacion2(number);
        setFetchCompleto2(true);
      });

  }, []);

  const calculos = () => {    
    let dolares = document.getElementById("dolares").value;
    setInput1(dolares * cotizacion2);
    setInput2((dolares * cotizacion2) * 0.3);
    setInput3((dolares * cotizacion2) * 0.45);
    setInput4((dolares * cotizacion2) * 1.75);
    setInput5((dolares * cotizacion) * 0.98);
    setInput6((dolares * cotizacion) - ((dolares * cotizacion) * 0.04 + 0.25));
  };


  return (
    <div className="w-screen flex justify-center items-center gap-5 ">
      <div className="px-12 py-12 sm:px-20 max-w-5xl flex gap-5 flex-wrap justify-evenly">
        <h1 className="text-4xl font-bold w-full text-center mb-2" style={{color: "#635bff"}}>
          Calculadora de pagos que recibo en Stripe
        </h1>
        <p className="text-xs w-full text-center"> <strong>Disclaimer:</strong> Esta calculadora es solo una aproximación. Las fuentes de datos pueden variar y no me hago responsable de los resultados obtenidos. Es solo una herramienta que desarrolle para mi uso personal. Para saber el monto aproximado que recibo si cobro en pesos argentinos en Stripe.</p>
        <p className="text-m w-full text-center mb-6"> Cotización euro: <strong style={{color: "#635bff"}}>U$D {reemplazarComa(cotizacion)}</strong> - Cotización del dolar: <strong style={{color: "#635bff"}}>AR$ {reemplazarComa(cotizacion2)}</strong><br /><span className="text-xs w-full text-center mb-6">Datos actualizados al: {new Date().toLocaleString()}</span></p>
        
        <TextField
          id="dolares"
          label="U$D (Dolares) que paga el cliente:"
          defaultValue="0"
          onChange={ () => calculos() }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">U$D </InputAdornment>
            ),
          }}
          variant="outlined"
          className={inputAncho}
          type="number"
        />
        <TextField
          label="U$D (Dolares) pasados a AR$ (Pesos Argentinos)"
          value={reemplazarComa(input1)}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">AR$</InputAdornment>
            ),
          }}
          variant="outlined"
          className={inputAnchoMedio + " " + soloLectura}
        />
        <TextField
          label="Impuesto Pais Ley 27.541 (+ 30%)"
          value={reemplazarComa(input2)}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">AR$</InputAdornment>
            ),
          }}
          variant="outlined"
          className={inputAnchoMedio + " " + soloLectura}
        />
        <TextField
          label="Percepcion Rg 4815/2020 (+ 45%)"
          value={reemplazarComa(input3)}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">AR$</InputAdornment>
            ),
          }}
          variant="outlined"
          className={inputAnchoMedio + " " + soloLectura}
        />
        <TextField
          label="Total en AR$ (con impuestos)"
          value={reemplazarComa(input4)}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">AR$</InputAdornment>
            ),
          }}
          variant="outlined"
          className={inputAnchoMedio + " " + soloLectura}
        />
        <TextField
          label="Pasando de U$D a EUR (menos 2% por conversión)"
          value={reemplazarComa(input5)}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">€</InputAdornment>
            ),
          }}
          variant="outlined"
          className={inputAnchoMedio + " " + soloLectura}
        />
        <TextField
          label="Final recibido (restando comisión de Stripe)"
          value={reemplazarComa(input6)}
          InputProps={{
            readOnly: true,
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
          variant="outlined"
          className={inputAnchoMedio + " " + soloLectura2}
        />
      <p className="text-s w-full text-center mt-6"> Hecho con la mejor 🤙 por <a href="https://github.com/creativoma" target="_blank"  style={{color: "#635bff"}}>Mariano Álvarez</a> - Copyright © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
export default App;