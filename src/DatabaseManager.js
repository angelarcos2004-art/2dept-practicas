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

const TABS = [
  { key: "carreras",      label: "Carreras" },
  { key: "profesores",    label: "Profesores" },
  { key: "alumnos",       label: "Alumnos" },
  { key: "materias",      label: "Materias" },
  { key: "grupos",        label: "Grupos" },
  { key: "inscripciones", label: "Inscripciones" },
];

const E = {
  carrera:     { nombre: "" },
  profesor:    { nombre: "", apellidos: "", carrera_id: "" },
  alumno:      { matricula: "", nombre: "", apellidos: "", correo_institucional: "", semestre_actual: "", carrera_id: "", tutor_id: "" },
  materia:     { nombre: "", semestre: "", carrera_id: "" },
  grupo:       { nombre_grupo: "", periodo: "", materia_id: "", profesor_id: "" },
  inscripcion: { matricula: "", grupo_id: "", calificacion: "", oportunidad: "", estado_calificacion_id: "" },
};

function DatabaseManager() {
  const [tab, setTab]         = useState("carreras");
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const [carreras,      setCarreras]      = useState([]);
  const [estados,       setEstados]       = useState([]);
  const [profesores,    setProfesores]    = useState([]);
  const [alumnos,       setAlumnos]       = useState([]);
  const [materias,      setMaterias]      = useState([]);
  const [grupos,        setGrupos]        = useState([]);
  const [inscripciones, setInscripciones] = useState([]);

  const [fCarrera,     setFCarrera]     = useState(E.carrera);
  const [fProfesor,    setFProfesor]    = useState(E.profesor);
  const [fAlumno,      setFAlumno]      = useState(E.alumno);
  const [fMateria,     setFMateria]     = useState(E.materia);
  const [fGrupo,       setFGrupo]       = useState(E.grupo);
  const [fInscripcion, setFInscripcion] = useState(E.inscripcion);

  useEffect(() => { loadAll(); }, []);

  const loadTable = async (table, setter, order = "id") => {
    const { data, error } = await supabase.from(table).select("*").order(order, { ascending: true });
    if (!error && data) setter(data);
  };

  const loadAll = () => {
    loadTable("carreras",             setCarreras);
    loadTable("estados_calificacion", setEstados);
    loadTable("profesores",           setProfesores);
    loadTable("alumnos",              setAlumnos,   "matricula");
    loadTable("materias",             setMaterias);
    loadTable("grupos",               setGrupos);
    loadTable("inscripciones",        setInscripciones);
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

  const switchTab = (key) => { setTab(key); setError(null); };

  return (
    <div className="dbm-container">
      <h2 className="dbm-title">Sistema de Gestión de una Escuela</h2>

      <div className="dbm-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`dbm-tab ${tab === t.key ? "active" : ""}`}
            onClick={() => switchTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="dbm-error">{error}</p>}

      {/* ── CARRERAS ── */}
      {tab === "carreras" && (
        <Section title="Carreras">
          <form className="dbm-form" onSubmit={(e) => {
            e.preventDefault();
            insert("carreras", { nombre: fCarrera.nombre },
              () => setFCarrera(E.carrera),
              () => loadTable("carreras", setCarreras));
          }}>
            <input name="nombre" value={fCarrera.nombre} onChange={ch(setFCarrera)} placeholder="Nombre de la carrera" required />
            <BtnAgregar loading={loading} />
          </form>
          <Tabla headers={["ID", "Nombre", ""]} empty={carreras.length === 0}>
            {carreras.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                <td><BtnEliminar onClick={() => remove("carreras", "id", c.id, () => loadTable("carreras", setCarreras))} /></td>
              </tr>
            ))}
          </Tabla>
        </Section>
      )}

      {/* ── PROFESORES ── */}
      {tab === "profesores" && (
        <Section title="Profesores">
          <form className="dbm-form" onSubmit={(e) => {
            e.preventDefault();
            insert("profesores",
              { nombre: fProfesor.nombre, apellidos: fProfesor.apellidos, carrera_id: parseInt(fProfesor.carrera_id) },
              () => setFProfesor(E.profesor),
              () => loadTable("profesores", setProfesores));
          }}>
            <div className="dbm-row2">
              <input name="nombre"    value={fProfesor.nombre}    onChange={ch(setFProfesor)} placeholder="Nombre"    required />
              <input name="apellidos" value={fProfesor.apellidos} onChange={ch(setFProfesor)} placeholder="Apellidos" required />
            </div>
            <select name="carrera_id" value={fProfesor.carrera_id} onChange={ch(setFProfesor)} required>
              <option value="">-- Selecciona Carrera --</option>
              {carreras.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <BtnAgregar loading={loading} />
          </form>
          <Tabla headers={["ID", "Nombre", "Apellidos", "Carrera", ""]} empty={profesores.length === 0}>
            {profesores.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.apellidos}</td>
                <td>{lookup(carreras, p.carrera_id)}</td>
                <td><BtnEliminar onClick={() => remove("profesores", "id", p.id, () => loadTable("profesores", setProfesores))} /></td>
              </tr>
            ))}
          </Tabla>
        </Section>
      )}

      {/* ── ALUMNOS ── */}
      {tab === "alumnos" && (
        <Section title="Alumnos">
          <form className="dbm-form" onSubmit={(e) => {
            e.preventDefault();
            insert("alumnos",
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
              () => loadTable("alumnos", setAlumnos, "matricula"));
          }}>
            <input name="matricula" value={fAlumno.matricula} onChange={ch(setFAlumno)} placeholder="Matrícula" required />
            <div className="dbm-row2">
              <input name="nombre"    value={fAlumno.nombre}    onChange={ch(setFAlumno)} placeholder="Nombre"    required />
              <input name="apellidos" value={fAlumno.apellidos} onChange={ch(setFAlumno)} placeholder="Apellidos" required />
            </div>
            <input type="email" name="correo_institucional" value={fAlumno.correo_institucional} onChange={ch(setFAlumno)} placeholder="Correo institucional" required />
            <div className="dbm-row2">
              <input type="number" name="semestre_actual" value={fAlumno.semestre_actual} onChange={ch(setFAlumno)} placeholder="Semestre actual" min="1" max="12" required />
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
                  <td><BtnEliminar onClick={() => remove("alumnos", "matricula", a.matricula, () => loadTable("alumnos", setAlumnos, "matricula"))} /></td>
                </tr>
              );
            })}
          </Tabla>
        </Section>
      )}

      {/* ── MATERIAS ── */}
      {tab === "materias" && (
        <Section title="Materias">
          <form className="dbm-form" onSubmit={(e) => {
            e.preventDefault();
            insert("materias",
              { nombre: fMateria.nombre, semestre: parseInt(fMateria.semestre), carrera_id: parseInt(fMateria.carrera_id) },
              () => setFMateria(E.materia),
              () => loadTable("materias", setMaterias));
          }}>
            <input name="nombre" value={fMateria.nombre} onChange={ch(setFMateria)} placeholder="Nombre de la materia" required />
            <div className="dbm-row2">
              <input type="number" name="semestre" value={fMateria.semestre} onChange={ch(setFMateria)} placeholder="Semestre" min="1" max="12" required />
              <select name="carrera_id" value={fMateria.carrera_id} onChange={ch(setFMateria)} required>
                <option value="">-- Carrera --</option>
                {carreras.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <BtnAgregar loading={loading} />
          </form>
          <Tabla headers={["ID", "Nombre", "Semestre", "Carrera", ""]} empty={materias.length === 0}>
            {materias.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nombre}</td>
                <td>{m.semestre}</td>
                <td>{lookup(carreras, m.carrera_id)}</td>
                <td><BtnEliminar onClick={() => remove("materias", "id", m.id, () => loadTable("materias", setMaterias))} /></td>
              </tr>
            ))}
          </Tabla>
        </Section>
      )}

      {/* ── GRUPOS ── */}
      {tab === "grupos" && (
        <Section title="Grupos">
          <form className="dbm-form" onSubmit={(e) => {
            e.preventDefault();
            insert("grupos",
              {
                nombre_grupo: fGrupo.nombre_grupo,
                periodo:      fGrupo.periodo,
                materia_id:   parseInt(fGrupo.materia_id),
                profesor_id:  parseInt(fGrupo.profesor_id),
              },
              () => setFGrupo(E.grupo),
              () => loadTable("grupos", setGrupos));
          }}>
            <div className="dbm-row2">
              <input name="nombre_grupo" value={fGrupo.nombre_grupo} onChange={ch(setFGrupo)} placeholder="Nombre del grupo (ej. A, B)" required />
              <input name="periodo"      value={fGrupo.periodo}      onChange={ch(setFGrupo)} placeholder="Periodo (ej. 2024-1)"         required />
            </div>
            <div className="dbm-row2">
              <select name="materia_id" value={fGrupo.materia_id} onChange={ch(setFGrupo)} required>
                <option value="">-- Materia --</option>
                {materias.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
              <select name="profesor_id" value={fGrupo.profesor_id} onChange={ch(setFGrupo)} required>
                <option value="">-- Profesor --</option>
                {profesores.map((p) => <option key={p.id} value={p.id}>{p.nombre} {p.apellidos}</option>)}
              </select>
            </div>
            <BtnAgregar loading={loading} />
          </form>
          <Tabla headers={["ID", "Grupo", "Periodo", "Materia", "Profesor", ""]} empty={grupos.length === 0}>
            {grupos.map((g) => {
              const prof = profesores.find((p) => p.id === g.profesor_id);
              return (
                <tr key={g.id}>
                  <td>{g.id}</td>
                  <td>{g.nombre_grupo}</td>
                  <td>{g.periodo}</td>
                  <td>{lookup(materias, g.materia_id)}</td>
                  <td>{prof ? `${prof.nombre} ${prof.apellidos}` : "—"}</td>
                  <td><BtnEliminar onClick={() => remove("grupos", "id", g.id, () => loadTable("grupos", setGrupos))} /></td>
                </tr>
              );
            })}
          </Tabla>
        </Section>
      )}

      {/* ── INSCRIPCIONES ── */}
      {tab === "inscripciones" && (
        <Section title="Inscripciones">
          <form className="dbm-form" onSubmit={(e) => {
            e.preventDefault();
            insert("inscripciones",
              {
                matricula:              fInscripcion.matricula,
                grupo_id:               parseInt(fInscripcion.grupo_id),
                calificacion:           fInscripcion.calificacion ? parseFloat(fInscripcion.calificacion) : null,
                oportunidad:            parseInt(fInscripcion.oportunidad),
                estado_calificacion_id: fInscripcion.estado_calificacion_id ? parseInt(fInscripcion.estado_calificacion_id) : null,
              },
              () => setFInscripcion(E.inscripcion),
              () => loadTable("inscripciones", setInscripciones));
          }}>
            <div className="dbm-row2">
              <select name="matricula" value={fInscripcion.matricula} onChange={ch(setFInscripcion)} required>
                <option value="">-- Alumno --</option>
                {alumnos.map((a) => <option key={a.matricula} value={a.matricula}>{a.matricula} – {a.nombre} {a.apellidos}</option>)}
              </select>
              <select name="grupo_id" value={fInscripcion.grupo_id} onChange={ch(setFInscripcion)} required>
                <option value="">-- Grupo --</option>
                {grupos.map((g) => <option key={g.id} value={g.id}>{g.nombre_grupo} ({g.periodo})</option>)}
              </select>
            </div>
            <div className="dbm-row3">
              <input type="number" step="0.1" min="0" max="100" name="calificacion" value={fInscripcion.calificacion} onChange={ch(setFInscripcion)} placeholder="Calificación" />
              <input type="number" min="1" max="5" name="oportunidad" value={fInscripcion.oportunidad} onChange={ch(setFInscripcion)} placeholder="Oportunidad" required />
              <select name="estado_calificacion_id" value={fInscripcion.estado_calificacion_id} onChange={ch(setFInscripcion)}>
                <option value="">-- Estado Cal. --</option>
                {estados.map((e) => <option key={e.id} value={e.id}>{e.estado}</option>)}
              </select>
            </div>
            <BtnAgregar loading={loading} />
          </form>
          <Tabla headers={["ID", "Alumno", "Grupo", "Calificación", "Oportunidad", "Estado", ""]} empty={inscripciones.length === 0}>
            {inscripciones.map((i) => {
              const grupo  = grupos.find((g) => g.id === i.grupo_id);
              const estado = estados.find((e) => e.id === i.estado_calificacion_id);
              return (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.matricula}</td>
                  <td>{grupo ? `${grupo.nombre_grupo} (${grupo.periodo})` : "—"}</td>
                  <td>{i.calificacion ?? "—"}</td>
                  <td>{i.oportunidad}</td>
                  <td>{estado ? estado.estado : "—"}</td>
                  <td><BtnEliminar onClick={() => remove("inscripciones", "id", i.id, () => loadTable("inscripciones", setInscripciones))} /></td>
                </tr>
              );
            })}
          </Tabla>
        </Section>
      )}
    </div>
  );
}

export default DatabaseManager;
