<?php
// Establece la URL de la página de conversión de moneda con los parámetros correspondientes
$url = 'https://www.xe.com/es/currencyconverter/convert/?Amount=1&From=EUR&To=USD';

// Inicia una sesión cURL
$ch = curl_init();

// Establece las opciones de la sesión cURL
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Ejecuta la solicitud y obtiene la respuesta
$response = curl_exec($ch);

// Cierra la sesión cURL
curl_close($ch);

// Analiza la respuesta HTML y extrae el valor de conversión
$dom = new DOMDocument();
@$dom->loadHTML($response);
$xpath = new DOMXPath($dom);
$elements = $xpath->query("//div[contains(@class, 'unit-rates___StyledDiv')]/p");
$value = trim($elements[0]->nodeValue);

// Eliminar el texto "1 EUR = " y el texto " USD" del final
$value = str_replace('1 USD = ', '', $value);
$value = str_replace(' EUR', '', $value);

// Cambiamos la coma por un punto. Ejemplo: 1,1234 a 1.1234
$value = str_replace(',', '.', $value);

// Pasamor el valor a un número de punto flotante de 4 decimales (por ejemplo: 1.1234)
$value = number_format($value, 2, '.', '');

// Pasar de string a número de punto flotante
$value = floatval($value);

// Crea un arreglo asociativo de PHP con el valor de conversión
$data = array(
    'EUR_to_USD' => $value
);

// Convierte el arreglo en un JSON y lo muestra en la pantalla
header('Content-Type: application/json');
echo json_encode($data);
?>
