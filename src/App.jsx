import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

const inputAnchoMedio = "w-[calc(50%-10px)]";
const inputAncho = "w-full";
const soloLectura = "bg-blue-50 dark:bg-gray-800";
const soloLectura2 = "bg-green-100 dark:bg-green-800";

function reemplazarComa(valor) {
  if (valor != "Cargando...") {
    let num = Math.round(valor * 100) / 100;
    num = num.toString();
    num = num.replace(".", ",");
    return num;
  } else {
    return valor;
  }
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
  const [input7, setInput7] = useState(0);

  useEffect(() => {
    try {
      // Realiza ambos fetch en paralelo
      Promise.all([
        fetch("https://creativoma.com/api/cotizacion-eur-usd/index.php").then(
          (response) => response.json()
        ),
        // fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales")
        //   .then((response) => response.json())
        //   .catch(() => {
        //     // En caso de error en el segundo fetch, retorna un valor predeterminado
        //     return { casa: { venta: "0" } };
        //   }),
        fetch("https://dolarapi.com/v1/dolares")
          .then((response) => response.json())
          .catch(() => {
            // En caso de error en el tercer fetch, retorna un valor predeterminado
            return [{ venta: "0" }];
          }),
      ])
        .then(([data, data3]) => {
          // Procesa los resultados y establece las variables de estado
          setCotizacion(data.EUR_to_USD);
          // setCotizacion2(parseFloat(data2?.casa?.venta?.replace(",", ".")) || 0);
          // Si el tercer fetch fue exitoso, puedes usar su valor, de lo contrario, se usará el valor predeterminado
          setCotizacion2(parseFloat(data3[0].venta));
          setFetchCompleto(true);
        })
        .catch((error) => {
          // Maneja los errores generales aquí
          console.error(error);
        });
    } catch (error) {
      // Maneja los errores generales aquí
      console.error(error);
    }
  }, []);

  const calculos = () => {
    let dolares = document.getElementById("dolares").value;
    setInput1(dolares * cotizacion2);
    setInput2(dolares * cotizacion2 * 0.3);
    // setInput3(dolares * cotizacion2 * 0.45);
    setInput7(dolares * cotizacion2 * 0.3);
    setInput4(dolares * cotizacion2 * 1.6);
    setInput5(dolares * cotizacion * 0.98);
    setInput6(dolares * cotizacion - (dolares * cotizacion * 0.04 + 0.25));
  };

  return (
    <div className="w-screen flex justify-center items-center gap-5 ">
      <div className="px-12 py-12 lg:px-20 sm:w-[80%] w-[100%] flex gap-5 flex-wrap justify-evenly">
        <h1
          className="text-4xl font-bold w-full text-center mb-2"
          style={{ color: "#635bff" }}
        >
          Calculadora de pagos que recibo en Stripe
        </h1>
        <p className="text-xs w-full text-center">
          {" "}
          <strong>Disclaimer:</strong> Esta calculadora es solo una
          aproximación. Las fuentes de datos pueden variar y no me hago
          responsable de los resultados obtenidos. Es solo una herramienta que
          desarrolle para mi uso personal. Para saber el monto aproximado que
          recibo si cobro en pesos argentinos en Stripe.
        </p>
        <p className="text-m w-full text-center mb-6">
          {" "}
          Cotización euro:{" "}
          <strong style={{ color: "#635bff" }}>
            U$D {reemplazarComa(cotizacion)}
          </strong>{" "}
          - Cotización del dolar:{" "}
          <strong style={{ color: "#635bff" }}>
            AR$ {reemplazarComa(cotizacion2)}
          </strong>
          <br />
          <span className="text-xs w-full text-center mb-6">
            Datos actualizados al: {new Date().toLocaleString()}
          </span>
        </p>
        <TextField
          id="dolares"
          label="U$D (Dolares) que paga el cliente:"
          defaultValue="0"
          onChange={() => calculos()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">U$D </InputAdornment>
            ),
          }}
          variant="outlined"
          className={inputAnchoMedio}
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
        {/* <TextField
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
        /> */}
        <TextField
          label="Percepcion Rg 5430 Afip (+ 30%)"
          value={reemplazarComa(input7)}
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
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
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
          className={inputAncho + " " + soloLectura2}
        />
        <p className="text-s w-full text-center mt-6">
          By{" "}
          <a
            href="https://github.com/creativoma"
            target="_blank"
            className="text-[#535bf2]"
          >
            Mariano Álvarez
          </a>{" "}
          ~ {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
export default App;
