# Enlace a la página:
https://short-url-frontend-khaki.vercel.app/

# Funcionamiento

Acortador de URLs que recibe una URL. La URL es enviada con petición _POST_
al backend (un servidor _separado del Front_), donde se valida, se _genera un ID_ único
con nanoid y, posteriormente, se guardan el ID y la Url original en la bbdd de MongoDB.
La base de datos consta de esos mismos 2 campos principales: _originalUrl y shortUrl_.
La _respuesta_ que envía la bbdd al front es del ID corto generado, y se permite al usuario
copiar el nuevo enlace o navegar directamente haciendo click en él

# Tecnologías usadas: TypeScript, TailwindCSS + DaisyUI. Desplegado en Vercel
