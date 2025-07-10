import { useState } from "react";
import "./App.css";

function App() {
  const URL_dominio = import.meta.env.VITE_URL_BACKEND;
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [longLoading, setLongLoading] = useState(false);
  const [respUrl, setRespUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  const handleLoading = async () => {
    setLoading(true);
    setLongLoading(false);
    setTimeout(() => {
      setLoading((prev_loading) => {
        if (prev_loading) {
          setLongLoading(true);
        }
        return prev_loading;
      });
    }, 5000);
  };

  const handleClick = async () => {
    if (urlInput.trim() === "" || !urlInput) {
      setError("La URL no puede estar vacía");
      return;
    } else if (!urlRegex.test(urlInput)) {
      setError("Por favor, ingresa una URL válida.");
      return;
    }

    handleLoading();
    setError("");
    console.log("Enviando: ", urlInput);

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ originalUrl: urlInput }),
    };

    try {
      const resp = await fetch(URL_dominio, params);
      if (resp.ok) {
        const data = await resp.json();
        setRespUrl(data.shortId);
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

  // Copiar al portapapeles usando URL formateada correctamente
  const handleCopy = () => {
    const urlToCopy = buildUrl(URL_dominio, respUrl);
    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Error al copiar: ", err));
  };

  // Formatear correctamente dominio + path
  function buildUrl(domain: string, path: string): string {
    const normalizedDomain = domain.replace(/\/+$/, "");
    const normalizedPath = path.replace(/^\/+/, "");
    return `${normalizedDomain}/${normalizedPath}`;
  }

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
                  href={buildUrl(URL_dominio, respUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {buildUrl(URL_dominio, respUrl)}
                </a>
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
