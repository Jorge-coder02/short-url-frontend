import { useState } from "react";
import "./App.css";

function App() {
  const URL_dominio = import.meta.env.VITE_URL_BACKEND;
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [longLoading, setLongLoading] = useState(false); //
  const [respUrl, setRespUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  const handleLoading = async () => {
    setLoading(true); // Mostrar msg Cargando...
    setLongLoading(false); // Ocultar msg de carga prolongada
    // cuando lleve 5 segundos, mostrar otro mensaje
    setTimeout(() => {
      setLoading((prev_loading) => {
        if (prev_loading) {
          setLongLoading(true); // Mostrar msg cargando largo
        }
        return prev_loading;
      });
    }, 5000);
  };

  const handleClick = async () => {
    // Validación mínima de URL
    if (urlInput.trim() === "" || !urlInput) {
      setError("La URL no puede estar vacía");
      return;
    } else if (!urlRegex.test(urlInput)) {
      setError("Por favor, ingresa una URL válida.");
      return;
    }

    // Si no hay errores ✅
    handleLoading(); // gestionar msg loading
    setError(""); // Limpiar cualquier error previo
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
        const data = await resp.json(); // objeto respuesta
        setRespUrl(data.shortId); // Guardar la URL acortada en el estado
      } else {
        console.error("Error al generar la URL corta");
        setError("Error al generar URL.");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud", error);
      setError("Error al generar URL: " + error);
    } finally {
      setLoading(false);
      setLongLoading(false);
    }
  };

  // Función para copiar la URL al portapapeles
  const handleCopy = () => {
    const urlToCopy = `${URL_dominio}/${respUrl}`; // Crear la URL completa
    navigator.clipboard
      .writeText(urlToCopy) // Copiar la URL al portapapeles
      .then(() => {
        setCopied(true); // Cambiar el estado a "copiado"
        setTimeout(() => setCopied(false), 2000); // Volver al texto original después de 2 segundos
      })
      .catch((err) => console.error("Error al copiar: ", err));
  };

  return (
    <div className="flex items-center justify-center pb-40 min-h-screen text-white">
      <div className="flex flex-col gap-8 max-w-2xl px-10 lg:px-10 py-10 rounded-xl div_app justify-center items-center">
        <h1 className="text-center text-4xl">ShortenURL by Jorge</h1>
        <input
          onChange={(e) => setUrlInput(e.target.value)}
          type="text"
          className="input w-[90%] text-center bg-slate-600 placeholder-white truncate"
          placeholder="Inserta URL"
        />
        <div className="flex justify-center">
          <button onClick={handleClick} className="btn px-20">
            {loading ? "Cargando..." : "Generar URL"}
          </button>
        </div>
        <span>
          {longLoading &&
            "El primer uso de la web en el día puede tomar hasta 25 segundos..."}
        </span>

        {error && <p className="text-red-500">{error}</p>}
        {respUrl && (
          <div className="flex flex-col gap-y-8 text-center">
            <div className="flex justify-center items-center flex-col">
              <span>Tu url generada: </span>
              <div className="flex lg:w-[100%] lg:flex-row flex-col items-center justify-center gap-x-4 gap-y-2">
                <a
                  className="hover:underline"
                  href={`${URL_dominio}/${respUrl}`}
                  target="_blank"
                >{`${URL_dominio}/${respUrl}`}</a>{" "}
                <button onClick={handleCopy} className="btn btn-success px-4">
                  {copied ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-y-1 text-gray-400">
              <span>ℹ ¿Por qué la URL no es tan corta? </span>
              <span className="text-sm">
                El servidor se aloja en un dominio sin coste, por comodidad.
                Este dominio no permite URLs cortas. Se espera migrar a un
                dominio propio en el futuro.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
