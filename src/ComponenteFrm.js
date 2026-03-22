import { useState } from "react";
import "./ComponenteFrm.css";

function ComponenteFrm() {

  const imagenes = [
    "/img1.jpg",
    "/img2.jpg",
    "/img3.jpg",
    "/img4.jpg",
    "/img5.jpg",
    "/img6.jpg"
  ];

  const [index, setIndex] = useState(0);

  const siguiente = () => {
    setIndex((index + 1) % imagenes.length);
  };

  const anterior = () => {
    setIndex((index - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div className="galeria-container">

      <h2>Galería de Imágenes</h2>

      <div className="slider-wrapper">

        <button onClick={anterior}>◀</button>

        <div className="slide-content">

          <img
            src={imagenes[index]}
            alt="galeria"
            className="slide-image"
          />

          <p>{index + 1} de {imagenes.length}</p>

        </div>

        <button onClick={siguiente}>▶</button>

      </div>

    </div>
  );
}

export default ComponenteFrm;