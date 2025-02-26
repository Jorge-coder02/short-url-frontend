import { useState } from "react";
import "./App.css";

function App() {
  const URL_dominio = "https://short-url-backend-cokq.onrender.com";
  const [urlInput, setUrlInput] = useState("");
  const [respUrl, setRespUrl] = useState("");

  const handleClick = async () => {
    console.log("Enviando: ", urlInput);

    // Enviar url al backend
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Necesario para enviar datos JSON
      },
      body: JSON.stringify({ originalUrl: urlInput }), // Convertir la URL en JSON
    };

    try {
      const resp = await fetch(URL_dominio, params);
      if (resp.ok) {
        const data = await resp.json();
        setRespUrl(data.shortId); // Guardar la URL acortada en el estado
        console.log("Respuesta servidor: ", data.shortId);
      } else {
        console.error("Error al generar la URL corta");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud", error);
    }
  };
  return (
    <div className="flex items-center justify-center pb-40 bg-slate-800 min-h-screen text-white">
      <div className="flex flex-col gap-8 place-items-center bg-slate-700 px-20 py-10 rounded-xl">
        <h1 className="text-4xl">ShortenURL by Jorge</h1>
        <input
          onChange={(e) => setUrlInput(e.target.value)}
          type="text"
          className="input px-20 text-center bg-slate-600 placeholder-white truncate"
          placeholder="Inserta URL"
        />
        <button onClick={handleClick} className="btn px-20">
          Generar URL
        </button>
        {respUrl && (
          <p>
            Tu url generada:{" "}
            <a
              href={`${URL_dominio}/${respUrl}`}
            >{`${URL_dominio}/${respUrl}`}</a>{" "}
            <button>Copiar</button>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
