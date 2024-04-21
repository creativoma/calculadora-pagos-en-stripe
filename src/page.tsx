import React, { FC, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const inputAnchoMedioClass = 'md:w-[calc(50%-10px)] w-full';
const soloLecturaClass = 'bg-blue-50 dark:bg-gray-800';
const soloLectura2Class = 'bg-green-100 dark:bg-green-800';

const Page: FC = () => {
  const [dolarTarjeta, setDolarTarjeta] = useState(0);
  const [dolarOficial, setDolarOficial] = useState(0);
  const [euroOficial, setEuroOficial] = useState(0);

  const [input1, setInput1] = useState(0);
  const [input2, setInput2] = useState(0);
  const [input3, setInput3] = useState(0);

  const calculate = () => {
    const dollars = parseFloat(
      (document.querySelector('#dolares') as HTMLInputElement).value
    );

    if (isNaN(dollars) || dollars < 0 || dollars === 0) {
      setInput1(0);
      setInput2(0);
      setInput3(0);
      return;
    }

    const dolarEuro = (dolarOficial * 100) / euroOficial / 100;

    setInput1(parseFloat((dollars * dolarTarjeta).toFixed(2)));
    setInput2(parseFloat((dollars * dolarEuro * 0.98).toFixed(2)));
    setInput3(
      parseFloat(
        (
          dollars * dolarEuro * 0.98 -
          (dollars * dolarEuro * 0.98 * 0.04 + 0.25)
        ).toFixed(2)
      )
    );
  };

  useEffect(() => {
    Promise.all([
      fetch('https://dolarapi.com/v1/dolares/tarjeta').then((response) =>
        response.json()
      ),
      fetch('https://dolarapi.com/v1/dolares/oficial').then((response) =>
        response.json()
      ),
      fetch('https://dolarapi.com/v1/cotizaciones/eur').then((response) =>
        response.json()
      ),
    ])
      .then(([dolarTarjetaData, dolarOficialData, euroOficialData]) => {
        setDolarTarjeta(dolarTarjetaData.venta);
        setDolarOficial(dolarOficialData.venta);
        setEuroOficial(euroOficialData.venta);
      })
      .catch((error) => {
        console.error('Error al obtener datos de cotización:', error);
      });
  }, []);

  return (
    <section className='relative w-screen h-screen flex flex-col justify-center items-center gap-5 px-10'>
      <div className='absolute top-0 z-[-2] h-full w-full bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]'></div>
      <div>
        <h1
          className='text-4xl font-bold text-center mb-4 text-balance'
          style={{ color: '#635bff' }}
        >
          Calculadora de pagos que recibo en Stripe
        </h1>
        <p className='text-xs text-center mx-auto text-balance max-w-[1240px]'>
          <strong>Disclaimer:</strong> Esta calculadora es solo una
          aproximación. Las fuentes de datos pueden variar y no me hago
          responsable de los resultados obtenidos. Es solo una herramienta que
          desarrolle para mi uso personal. Para saber el monto aproximado que
          recibo si cobro en pesos argentinos en Stripe.
        </p>
      </div>
      <div className='flex gap-6'>
        <p className='text-sm text-center'>
          <span>Dolar tarjeta: </span>
          <strong style={{ color: '#635bff' }}>
            {Intl.NumberFormat('es-AR', {
              style: 'currency',
              currency: 'ARS',
            }).format(dolarTarjeta)}
          </strong>
        </p>
        <p className='text-sm text-center'>
          <span>Dolar oficial: </span>
          <strong style={{ color: '#635bff' }}>
            {Intl.NumberFormat('es-AR', {
              style: 'currency',
              currency: 'ARS',
            }).format(dolarOficial)}
          </strong>
        </p>
        <p className='text-sm text-center'>
          <span>Euro oficial: </span>
          <strong style={{ color: '#635bff' }}>
            {Intl.NumberFormat('es-AR', {
              style: 'currency',
              currency: 'ARS',
            }).format(euroOficial)}
          </strong>
        </p>
      </div>
      <p className='text-xs font-bold mb-6'>
        <span>
          Datos actualizados al:{' '}
          {Intl.DateTimeFormat('es-AR').format(new Date())}
        </span>
      </p>
      <div className='flex gap-5 flex-wrap justify-evenly flex-col w-full md:flex-row md:w-[700px]'>
        <TextField
          id='dolares'
          label='U$D (Dolares) que paga el cliente:'
          onChange={() => calculate()}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>U$D </InputAdornment>
            ),
          }}
          variant='outlined'
          className={inputAnchoMedioClass}
          type='number'
        />
        <TextField
          label='U$D (Dolares) pasados a AR$ (Pesos Argentinos)'
          value={input1}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position='start'>AR$</InputAdornment>
            ),
          }}
          variant='outlined'
          type='number'
          className={inputAnchoMedioClass + ' ' + soloLecturaClass}
        />
        <TextField
          label='Pasando de U$D a EUR (menos 2% por conversión)'
          value={input2}
          InputProps={{
            readOnly: true,
            startAdornment: <InputAdornment position='start'>€</InputAdornment>,
          }}
          variant='outlined'
          className={inputAnchoMedioClass + ' ' + soloLecturaClass}
        />
        <TextField
          label='Final recibido (restando comisión de Stripe)'
          value={input3}
          InputProps={{
            readOnly: true,
            startAdornment: <InputAdornment position='start'>€</InputAdornment>,
          }}
          variant='outlined'
          className={inputAnchoMedioClass + ' ' + soloLectura2Class}
        />
      </div>
    </section>
  );
};

export default Page;
