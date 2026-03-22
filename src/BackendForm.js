import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./DatabaseManager.css";

function Section({ title, children }) {
  return (
    <div className="dbm-section">
      <h3 className="dbm-section-title">{title}</h3>
      {children}
    </div>
  );
}

function Tabla({ headers, children, empty }) {
  return (
    <div className="dbm-tabla-wrap">
      <table className="dbm-tabla">
        <thead>
          <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {empty ? (
            <tr><td colSpan={headers.length} className="dbm-sin-datos">Sin registros.</td></tr>
          ) : children}
        </tbody>
      </table>
    </div>
  );
}

function BtnAgregar({ loading }) {
  return (
    <div className="dbm-btn-row">
      <button type="submit" className="dbm-btn-agregar" disabled={loading}>
        {loading ? "Guardando..." : "Agregar"}
      </button>
    </div>
  );
}

function BtnEliminar({ onClick }) {
  return (
    <button type="button" className="dbm-btn-eliminar" onClick={onClick}>
      Eliminar
    </button>
  );
}

const lookup = (arr, id, field = "nombre") => {
  const found = arr.find((x) => x.id === id);
  return found ? found[field] : "—";
};

const E = {
  alumno: { matricula: "", nombre: "", apellidos: "", correo_institucional: "", semestre_actual: "", carrera_id: "", tutor_id: "" },
};

function BackendForm() {
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const [carreras,   setCarreras]   = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [alumnos,    setAlumnos]    = useState([]);

  const [fAlumno, setFAlumno] = useState(E.alumno);

  useEffect(() => {
    loadTable("carreras",   setCarreras);
    loadTable("profesores", setProfesores);
    loadTable("alumnos",    setAlumnos, "matricula");
  }, []);

  const loadTable = async (table, setter, order = "id") => {
    const { data, error } = await supabase.from(table).select("*").order(order, { ascending: true });
    if (error) setError(`Error cargando '${table}': ${error.message}`);
    else if (data) setter(data);
  };

  const ch = (setter) => (e) =>
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const insert = async (table, payload, resetFn, reloadFn) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from(table).insert([payload]);
    if (error) setError(error.message);
    else { resetFn(); reloadFn(); }
    setLoading(false);
  };

  const remove = async (table, col, val, reloadFn) => {
    setError(null);
    const { error } = await supabase.from(table).delete().eq(col, val);
    if (error) setError(error.message);
    else reloadFn();
  };

  return (
    <div className="dbm-container">
      <h2 className="dbm-title">Sistema de Gestión de una Escuela</h2>

      {error && <p className="dbm-error">{error}</p>}

      <Section title="Alumnos">
        <form
          className="dbm-form"
          onSubmit={(e) => {
            e.preventDefault();
            insert(
              "alumnos",
              {
                matricula:            fAlumno.matricula,
                nombre:               fAlumno.nombre,
                apellidos:            fAlumno.apellidos,
                correo_institucional: fAlumno.correo_institucional,
                semestre_actual:      parseInt(fAlumno.semestre_actual),
                carrera_id:           parseInt(fAlumno.carrera_id),
                tutor_id:             fAlumno.tutor_id ? parseInt(fAlumno.tutor_id) : null,
              },
              () => setFAlumno(E.alumno),
              () => loadTable("alumnos", setAlumnos, "matricula")
            );
          }}
        >
          <input
            name="matricula"
            value={fAlumno.matricula}
            onChange={ch(setFAlumno)}
            placeholder="Matrícula"
            required
          />
          <div className="dbm-row2">
            <input name="nombre"    value={fAlumno.nombre}    onChange={ch(setFAlumno)} placeholder="Nombre"    required />
            <input name="apellidos" value={fAlumno.apellidos} onChange={ch(setFAlumno)} placeholder="Apellidos" required />
          </div>
          <input
            type="email"
            name="correo_institucional"
            value={fAlumno.correo_institucional}
            onChange={ch(setFAlumno)}
            placeholder="Correo institucional"
            required
          />
          <div className="dbm-row2">
            <input
              type="number"
              name="semestre_actual"
              value={fAlumno.semestre_actual}
              onChange={ch(setFAlumno)}
              placeholder="Semestre actual"
              min="1" max="12"
              required
            />
            <select name="carrera_id" value={fAlumno.carrera_id} onChange={ch(setFAlumno)} required>
              <option value="">-- Carrera --</option>
              {carreras.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <select name="tutor_id" value={fAlumno.tutor_id} onChange={ch(setFAlumno)}>
            <option value="">-- Tutor (Opcional) --</option>
            {profesores.map((p) => <option key={p.id} value={p.id}>{p.nombre} {p.apellidos}</option>)}
          </select>
          <BtnAgregar loading={loading} />
        </form>

        <Tabla headers={["Matrícula", "Nombre", "Apellidos", "Correo", "Sem.", "Carrera", "Tutor", ""]} empty={alumnos.length === 0}>
          {alumnos.map((a) => {
            const tutor = profesores.find((p) => p.id === a.tutor_id);
            return (
              <tr key={a.matricula}>
                <td>{a.matricula}</td>
                <td>{a.nombre}</td>
                <td>{a.apellidos}</td>
                <td>{a.correo_institucional}</td>
                <td>{a.semestre_actual}</td>
                <td>{lookup(carreras, a.carrera_id)}</td>
                <td>{tutor ? `${tutor.nombre} ${tutor.apellidos}` : "—"}</td>
                <td>
                  <BtnEliminar onClick={() => remove("alumnos", "matricula", a.matricula, () => loadTable("alumnos", setAlumnos, "matricula"))} />
                </td>
              </tr>
            );
          })}
        </Tabla>
      </Section>
    </div>
  );
}

export default BackendForm;
