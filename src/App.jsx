import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

const SUB_MATERIAS = {
  civil: [
    { id: "1. TEORÍA GENERAL DE LA LEY.", label: "1. Teoría General de la Ley", type: "tema" },
    { id: "2.-DE LAS PERSONAS.", label: "2. De las Personas", type: "tema" },
    { id: "3.-TEORÍA GENERALDELnegocio jurídico.", label: "3. Teoría General del Negocio Jurídico", type: "tema" },
    { id: "4.-DERECHOS REALES.", label: "4. Derechos Reales", type: "tema" },
    { id: "5.-TEORÍA GENERAL DE LAS OBLIGACIONES.", label: "5. Teoría General de las Obligaciones", type: "tema" },
    { id: "6.-LOS CONTRATOS.", label: "6. Los Contratos", type: "tema" },
    { id: "7.-RESPONSABILIDAD EXTRACONTRACTUAL.", label: "7. Responsabilidad Extracontractual", type: "tema" },
    { id: "8.- DERECHO DE FAMILIA.", label: "8. Derecho de Familia", type: "tema" },
    { id: "9.-DERECHO SUCESORIO.", label: "9. Derecho Sucesorio", type: "tema" }
  ],
  constitucional: [
    { id: "1. Bases de la Institucionalidad", label: "1. Bases de la Institucionalidad", type: "tema" },
    { id: "2.-Derechos y Garantias Constitucionales", label: "2. Derechos y Garantías Constitucionales", type: "tema" },
    { id: "3.-Gobierno", label: "3. Gobierno", type: "tema" },
    { id: "4.- Congreso Nacional.", label: "4. Congreso Nacional", type: "tema" },
    { id: "5.-Tribunal Constitucional.", label: "5. Tribunal Constitucional", type: "tema" },
    { id: "6.Aspectos fundamentales relativos a funciones de:", label: "6. Funciones de Órganos y otros", type: "tema" }
  ],
  procesal: [
    // Orgánico (General)
    { id: "organico_jurisdiccion", label: "1. La Jurisdicción", type: "subtema", tema: "General", subtema: "La Jurisdicción" },
    { id: "organico_competencia", label: "2. La Competencia", type: "subtema", tema: "General", subtema: "La Competencia" },
    { id: "organico_tribunales", label: "3. Los Tribunales", type: "subtema", tema: "General", subtema: "Los Tribunales" },
    { id: "organico_general", label: "4. Conceptos Generales (Orgánico)", type: "subtema", tema: "General", subtema: "General" },
    
    // Civil
    { id: "civil_partes", label: "5. Las Partes (Procesal Civil)", type: "subtema", tema: "2.DERECHO PROCESAL CIVIL", subtema: "Las Partes" },
    { id: "civil_accion", label: "6. La Acción", type: "subtema", tema: "2.DERECHO PROCESAL CIVIL", subtema: "La Acción" },
    { id: "civil_reaccion", label: "7. La Reacción", type: "subtema", tema: "2.DERECHO PROCESAL CIVIL", subtema: "La ReAcción" },
    { id: "civil_proceso", label: "8. El Proceso", type: "subtema", tema: "2.DERECHO PROCESAL CIVIL", subtema: "El Proceso" },
    { id: "civil_actuaciones", label: "9. Las Actuaciones Procesales", type: "subtema", tema: "2.DERECHO PROCESAL CIVIL", subtema: "Las Actuaciones Procesales" },
    { id: "civil_incidentes", label: "10. Los Incidentes", type: "subtema", tema: "2.DERECHO PROCESAL CIVIL", subtema: "Los Incidentes" },
    { id: "civil_ordinario", label: "11. Procedimiento Ordinario", type: "subtema", tema: "2.DERECHO PROCESAL CIVIL", subtema: "El Procedimiento Civil Declarativo Ordinario" },
    { id: "civil_sumario", label: "12. Procedimiento Sumario", type: "subtema", tema: "2.DERECHO PROCESAL CIVIL", subtema: "El Procedimiento Sumario" },
    { id: "civil_ejecutivo", label: "13. Procedimiento Ejecutivo", type: "subtema", tema: "2.DERECHO PROCESAL CIVIL", subtema: "El Procedimiento ejecutivo" },
    { id: "civil_cuaderno_ejecutivo", label: "14. Tramitación Cuaderno Ejecutivo", type: "subtema", tema: "2.DERECHO PROCESAL CIVIL", subtema: "Tramitacion del Cuaderno ejecutivo:" },
    { id: "civil_recursos", label: "15. Recursos Procesales Civiles", type: "subtema", tema: "2.DERECHO PROCESAL CIVIL", subtema: "Los recursos Procesales Civiles" },

    // Penal
    { id: "penal_general", label: "16. Conceptos Generales (Procesal Penal)", type: "subtema", tema: "3.DERECHO PROCESAL PENAL", subtema: "General" },
    { id: "penal_juicio_oral", label: "17. El Juicio Oral", type: "subtema", tema: "3.DERECHO PROCESAL PENAL", subtema: "6) EI Juicio Oral:" },
    { id: "penal_recursos", label: "18. Recursos Procesales Penales", type: "subtema", tema: "3.DERECHO PROCESAL PENAL", subtema: "b) Los recursos Procesales Penales:" },
    { id: "penal_procedimientos", label: "19. Procedimientos Especiales (Penal)", type: "subtema", tema: "3.DERECHO PROCESAL PENAL", subtema: "c) Procedimientos Especiales:" }
  ]
};

const getSubmateriaDistribution = (total, selectedList) => {
  const count = selectedList.length
  const dist = {}
  if (count === 0) return dist
  
  const base = Math.floor(total / count)
  let remainder = total % count
  
  selectedList.forEach(item => {
    dist[item] = base
  })
  
  for (let i = 0; i < remainder; i++) {
    dist[selectedList[i]] += 1
  }
  return dist
}

// Componente de formulario de feedback individual para cada pregunta en la revisión
function FeedbackForm({ questionId, anonUserId }) {
  const [feedbackPregunta, setFeedbackPregunta] = useState('')
  const [feedbackRespuesta, setFeedbackRespuesta] = useState('')
  const [feedbackEnviado, setFeedbackEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSendFeedbackLocal = async () => {
    if (!feedbackPregunta && !feedbackRespuesta) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('feedbacks')
        .insert({
          pregunta_id: questionId,
          usuario_anonimo_id: anonUserId,
          feedback_pregunta: feedbackPregunta || null,
          feedback_respuesta: feedbackRespuesta || null
        })
        
      if (error) throw error
      setFeedbackEnviado(true)
    } catch (err) {
      console.error("Error al enviar feedback:", err)
      alert("No se pudo enviar el feedback. Revisa la consola o configuración de Supabase.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="feedback-box" style={{ background: 'rgba(0,0,0,0.15)' }}>
      <div className="feedback-header" style={{ fontSize: '0.9rem' }}>
        📝 Reportar sugerencias para esta pregunta
      </div>
      
      {feedbackEnviado ? (
        <div style={{ padding: '0.5rem', background: 'var(--success-glow)', border: '1px solid var(--success)', borderRadius: '8px', color: '#34d399', fontSize: '0.85rem', textAlign: 'center' }}>
          ✔️ Retroalimentación guardada.
        </div>
      ) : (
        <div>
          <div className="feedback-inputs" style={{ gap: '0.75rem' }}>
            <div>
              <textarea 
                placeholder="Reportar error en enunciado..."
                value={feedbackPregunta}
                onChange={(e) => setFeedbackPregunta(e.target.value)}
                style={{ minHeight: '60px', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <textarea 
                placeholder="Reportar error en alternativas..."
                value={feedbackRespuesta}
                onChange={(e) => setFeedbackRespuesta(e.target.value)}
                style={{ minHeight: '60px', fontSize: '0.85rem' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn-outline" 
              onClick={handleSendFeedbackLocal}
              disabled={loading || (!feedbackPregunta && !feedbackRespuesta)}
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
            >
              {loading ? 'Enviando...' : 'Enviar Reporte'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


export default function App() {
  // App States: 'config' | 'loading' | 'quiz' | 'results'
  const [screen, setScreen] = useState('config')
  
  // Quiz configuration
  const [totalQuestions, setTotalQuestions] = useState(15)
  const [timeLimit, setTimeLimit] = useState(30)
  const [correctionMode, setCorrectionMode] = useState('immediate') // 'immediate' | 'deferred'
  const [selectedAreas, setSelectedAreas] = useState({
    civil: true,
    procesal: true,
    constitucional: true
  })

  // State for sub-subjects selection (checked by default)
  const [selectedSubmaterias, setSelectedSubmaterias] = useState(() => {
    const initial = {}
    Object.keys(SUB_MATERIAS).forEach(area => {
      SUB_MATERIAS[area].forEach(sub => {
        initial[sub.id] = true
      })
    })
    return initial
  })

  // State to control expansion of submaterias list
  const [showSubmaterias, setShowSubmaterias] = useState(false)

  // Dynamic limits based on sub-subjects filtering
  const activeAreas = Object.keys(selectedAreas).filter(area => selectedAreas[area]);
  const availableSubmaterias = [];
  activeAreas.forEach(area => {
    SUB_MATERIAS[area].forEach(sub => {
      availableSubmaterias.push(sub.id);
    });
  });

  const activeSelectedSubmaterias = availableSubmaterias.filter(id => selectedSubmaterias[id]);
  const isFilteredMode = activeSelectedSubmaterias.length < availableSubmaterias.length;

  const minQuestions = isFilteredMode ? 1 : 3;
  const maxQuestions = isFilteredMode ? 15 : 60;

  // Auto-adjust questions count when slider bounds change
  useEffect(() => {
    if (isFilteredMode) {
      if (totalQuestions > 15) {
        setTotalQuestions(15);
      }
    } else {
      if (totalQuestions < 3) {
        setTotalQuestions(3);
      }
    }
  }, [isFilteredMode, totalQuestions]);

  const toggleArea = (key) => {
    setSelectedAreas(prev => {
      const activeKeys = Object.keys(prev).filter(k => prev[k])
      if (activeKeys.length === 1 && prev[key]) {
        // Prevent deselecting the only active area
        return prev
      }
      
      const newActiveState = !prev[key];
      
      // Sync sub-subjects: check/uncheck all of this area
      setSelectedSubmaterias(subPrev => {
        const next = { ...subPrev };
        SUB_MATERIAS[key].forEach(sub => {
          next[sub.id] = newActiveState;
        });
        return next;
      });

      return {
        ...prev,
        [key]: newActiveState
      }
    })
  }

  const toggleSubmateria = (subId, areaKey) => {
    setSelectedSubmaterias(prev => {
      // Prevent deselecting the last active subtopic across all active areas
      const activeAreasList = Object.keys(selectedAreas).filter(k => selectedAreas[k]);
      const available = [];
      activeAreasList.forEach(a => {
        SUB_MATERIAS[a].forEach(sub => {
          available.push(sub.id);
        });
      });
      const selected = available.filter(id => id === subId ? !prev[id] : prev[id]);
      
      if (selected.length === 0) {
        return prev;
      }
      
      return {
        ...prev,
        [subId]: !prev[subId]
      };
    });
  };

  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [userAnswers, setUserAnswers] = useState({}) // { questionIndex: { selectedIndex, isCorrect, options } }
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(0) // in seconds
  const timerRef = useRef(null)
  
  // Feedback states
  const [feedbackPregunta, setFeedbackPregunta] = useState('')
  const [feedbackRespuesta, setFeedbackRespuesta] = useState('')
  const [feedbackEnviado, setFeedbackEnviado] = useState(false)
  const [feedbackIdPregunta, setFeedbackIdPregunta] = useState(null)
  
  // Anonymous user ID
  const [anonUserId, setAnonUserId] = useState('')
  
  // Modals / Overlays
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [visitCount, setVisitCount] = useState(null)

  // On mount, generate/fetch anonymous user ID
  useEffect(() => {
    const fetchAnonId = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json')
        const data = await res.json()
        // Simple hash of the IP for anonymity
        let hash = 0
        const ip = data.ip || '127.0.0.1'
        for (let i = 0; i < ip.length; i++) {
          hash = (hash << 5) - hash + ip.charCodeAt(i)
          hash |= 0 // 32bit integer
        }
        setAnonUserId(`anon_${Math.abs(hash)}`)
      } catch (e) {
        // Fallback using localStorage
        let localId = localStorage.getItem('anon_user_id')
        if (!localId) {
          localId = `anon_local_${Math.floor(Math.random() * 10000000)}`
          localStorage.setItem('anon_user_id', localId)
        }
        setAnonUserId(localId)
      }
    }
    fetchAnonId()
  }, [])

  // Visit counter tracking
  useEffect(() => {
    if (!anonUserId) return

    const registerAndGetVisits = async () => {
      try {
        const alreadyRegistered = sessionStorage.getItem('visita_registrada')
        if (!alreadyRegistered) {
          await supabase
            .from('visitas')
            .insert({ usuario_anonimo_id: anonUserId })
          sessionStorage.setItem('visita_registrada', 'true')
        }

        // Get total visits count
        const { count, error } = await supabase
          .from('visitas')
          .select('*', { count: 'exact', head: true })

        if (!error && count !== null) {
          setVisitCount(count)
        }
      } catch (e) {
        console.error("Error al registrar/obtener visitas:", e)
      }
    }

    registerAndGetVisits()
  }, [anonUserId])

  // Manage Timer Countdown
  useEffect(() => {
    if (screen === 'quiz' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleFinishQuiz(true) // Auto-submit when time is up
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [screen, timeLeft])

  // Shuffle options whenever the question changes
  useEffect(() => {
    if (questions.length > 0 && screen === 'quiz') {
      const q = questions[currentIdx]
      const options = [
        { text: q.respuesta_correcta, isCorrect: true },
        { text: q.incorrecta_1, isCorrect: false },
        { text: q.incorrecta_2, isCorrect: false },
        { text: q.incorrecta_3, isCorrect: false }
      ]
      
      // Fisher-Yates shuffle
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]]
      }
      
      setShuffledOptions(options)
      setSelectedOpt(null)
      setIsAnswered(false)
      setFeedbackPregunta('')
      setFeedbackRespuesta('')
      setFeedbackEnviado(false)
    }
  }, [questions, currentIdx, screen])

  // Formats time in mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Question Division logic (Priority Civil)
  const getDistribution = (total, selected) => {
    const activeKeys = Object.keys(selected).filter(k => selected[k])
    const count = activeKeys.length
    
    const dist = { civil: 0, procesal: 0, constitucional: 0 }
    if (count === 0) return dist
    
    const base = Math.floor(total / count)
    let remainder = total % count
    
    activeKeys.forEach(k => {
      dist[k] = base
    })
    
    const priority = ['civil', 'procesal', 'constitucional']
    for (const k of priority) {
      if (remainder > 0 && selected[k]) {
        dist[k] += 1
        remainder -= 1
      }
    }
    return dist
  }

  // Load questions from Supabase
  const handleStartQuiz = async () => {
    setScreen('loading')
    setErrorMsg('')
    
    try {
      let allQuestions = [];
      
      if (isFilteredMode) {
        // Modo Filtrado: Consultas dirigidas por tema
        const subDist = getSubmateriaDistribution(totalQuestions, activeSelectedSubmaterias);
        const fetchPromises = Object.keys(subDist)
          .filter(subId => subDist[subId] > 0)
          .map(async (subId) => {
            const limit = subDist[subId];
            
            // Buscar la configuración del tema/subtema
            let subObj = null;
            for (const area of Object.keys(SUB_MATERIAS)) {
              const match = SUB_MATERIAS[area].find(s => s.id === subId);
              if (match) {
                subObj = match;
                break;
              }
            }
            
            let query = supabase.from('preguntas').select('*');
            if (subObj && subObj.type === 'subtema') {
              query = query.eq('tema', subObj.tema).eq('subtema', subObj.subtema);
            } else {
              query = query.eq('tema', subId);
            }
            
            const { data, error } = await query
              .not('incorrecta_1', 'is', null)
              .limit(limit * 3);
            if (error) throw error;
            return [...data].sort(() => Math.random() - 0.5).slice(0, limit);
          });
        
        const results = await Promise.all(fetchPromises);
        allQuestions = results.flat();
      } else {
        // Modo Completo (flujo original)
        const dist = getDistribution(totalQuestions, selectedAreas)
        
        // Helper function to call random RPC
        const fetchAreaRandom = async (area, limit) => {
          const { data, error } = await supabase.rpc('obtener_preguntas_aleatorias', {
            p_area: area,
            p_limite: limit
          })
          if (error) throw error
          return data
        }

        let civilQuestions = []
        let procesalQuestions = []
        let constQuestions = []

        try {
          const promises = []
          if (dist.civil > 0) {
            promises.push(fetchAreaRandom('DERECHO CIVIL', dist.civil).then(res => civilQuestions = res))
          }
          if (dist.procesal > 0) {
            promises.push(fetchAreaRandom('DERECHO PROCESAL', dist.procesal).then(res => procesalQuestions = res))
          }
          if (dist.constitucional > 0) {
            promises.push(fetchAreaRandom('DERECHO CONSTITUCIONAL', dist.constitucional).then(res => constQuestions = res))
          }
          await Promise.all(promises)
        } catch (rpcErr) {
          console.warn("⚠️ RPC function failed, falling back to standard select query...", rpcErr)
          
          // Fallback standard select
          const fetchAreaFallback = async (area, limit) => {
            const { data, error } = await supabase
              .from('preguntas')
              .select('*')
              .eq('area', area)
              .not('incorrecta_1', 'is', null)
              .limit(limit * 2) // Fetch a bit extra to randomize locally
            if (error) throw error
            
            // Randomize subset
            return [...data].sort(() => Math.random() - 0.5).slice(0, limit)
          }

          const fallbackPromises = []
          if (dist.civil > 0) {
            fallbackPromises.push(fetchAreaFallback('DERECHO CIVIL', dist.civil).then(res => civilQuestions = res))
          }
          if (dist.procesal > 0) {
            fallbackPromises.push(fetchAreaFallback('DERECHO PROCESAL', dist.procesal).then(res => procesalQuestions = res))
          }
          if (dist.constitucional > 0) {
            fallbackPromises.push(fetchAreaFallback('DERECHO CONSTITUCIONAL', dist.constitucional).then(res => constQuestions = res))
          }
          await Promise.all(fallbackPromises)
        }

        allQuestions = [...civilQuestions, ...procesalQuestions, ...constQuestions]
      }
      
      if (allQuestions.length === 0) {
        throw new Error("No se encontraron preguntas en la base de datos. Verifica la importación del CSV o las submaterias seleccionadas.")
      }

      // Shuffle complete quiz order
      allQuestions.sort(() => Math.random() - 0.5)
      
      setQuestions(allQuestions)
      setCurrentIdx(0)
      setUserAnswers({})
      setTimeLeft(timeLimit * 60)
      setScreen('quiz')
      
    } catch (err) {
      console.error(err)
      const userFriendlyError = (err.message && err.message.toLowerCase().includes('failed to fetch'))
        ? "Error al conectar con la base de datos. Esto ocurre porque no se han configurado las credenciales de Supabase en el archivo .env, la base de datos está inactiva o no hay conexión a Internet."
        : (err.message || "Error al conectar con la base de datos. Asegúrate de configurar las variables de entorno.");
      setErrorMsg(userFriendlyError)
      setScreen('config')
    }
  }

  // Handle immediate verification or saving answer
  const handleSelectOption = (idx) => {
    if (isAnswered && correctionMode === 'immediate') return
    setSelectedOpt(idx)
  }

  const handleVerifyAnswer = () => {
    if (selectedOpt === null) return
    
    const isCorrect = shuffledOptions[selectedOpt].isCorrect
    
    // Save to userAnswers state
    setUserAnswers(prev => ({
      ...prev,
      [currentIdx]: {
        selectedIndex: selectedOpt,
        isCorrect: isCorrect,
        options: shuffledOptions
      }
    }))
    
    setIsAnswered(true)
  }

  const handleNextQuestion = () => {
    // If not immediate mode, save answer silently on next
    if (correctionMode === 'deferred') {
      const isCorrect = selectedOpt !== null ? shuffledOptions[selectedOpt].isCorrect : false
      setUserAnswers(prev => ({
        ...prev,
        [currentIdx]: {
          selectedIndex: selectedOpt,
          isCorrect: isCorrect,
          options: shuffledOptions
        }
      }))
    }

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1)
    } else {
      handleFinishQuiz(false)
    }
  }

  const handleFinishQuiz = (auto = false) => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    // In deferred mode, if user finishes, save the final active question answer
    if (correctionMode === 'deferred' && !auto) {
      const isCorrect = selectedOpt !== null ? shuffledOptions[selectedOpt].isCorrect : false
      setUserAnswers(prev => {
        const updated = {
          ...prev,
          [currentIdx]: {
            selectedIndex: selectedOpt,
            isCorrect: isCorrect,
            options: shuffledOptions
          }
        }
        return updated
      })
    }

    setScreen('results')
  }

  // Handle Feedback Submission
  const handleSendFeedback = async (qId) => {
    if (!feedbackPregunta && !feedbackRespuesta) return
    
    try {
      const { error } = await supabase
        .from('feedbacks')
        .insert({
          pregunta_id: qId,
          usuario_anonimo_id: anonUserId,
          feedback_pregunta: feedbackPregunta || null,
          feedback_respuesta: feedbackRespuesta || null
        })
        
      if (error) throw error
      
      setFeedbackEnviado(true)
      setFeedbackIdPregunta(qId)
    } catch (err) {
      console.error("Error al enviar feedback:", err)
      alert("No se pudo enviar el feedback. Revisa la consola o configuración de Supabase.")
    }
  }

  // Reset quiz
  const handleRestart = () => {
    setQuestions([])
    setCurrentIdx(0)
    setSelectedOpt(null)
    setIsAnswered(false)
    setUserAnswers({})
    setScreen('config')
  }

  // Calculate final score statistics
  const getScoreStats = () => {
    const total = questions.length
    if (total === 0) return { score: 0, correct: 0, incorrect: 0 }
    
    let correct = 0
    Object.values(userAnswers).forEach(ans => {
      if (ans.isCorrect) correct++
    })
    
    const score = Math.round((correct / total) * 100)
    const incorrect = total - correct
    
    return { score, correct, incorrect }
  }
  const stats = getScoreStats()
  const dist = getDistribution(totalQuestions, selectedAreas)
  return (
    <div className="glass-panel">
      {/* 1. CONFIG SCREEN */}
      {screen === 'config' && (
        <div>
          <h1>Examen de Grado Derecho</h1>
          <p className="subtitle">Asistente de Estudio Inteligente con Inteligencia Artificial</p>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#cbd5e1' }}>Preparación Integral</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8' }}>
              Esta herramienta simula interrogaciones del examen de grado de Derecho en Chile. Las preguntas y alternativas incorrectas fueron refinadas por Inteligencia Artificial para asegurar verosimilitud y el máximo rigor legal.
            </p>
          </div>

          {errorMsg && (
            <div style={{ padding: '1rem', background: 'var(--danger-glow)', border: '1px solid var(--danger)', borderRadius: '12px', color: '#f87171', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Materias Selector */}
          <div className="control-group">
            <label>Materias a Evaluar</label>
            <div className="subject-selectors">
              <button 
                type="button"
                className={`subject-btn ${selectedAreas.civil ? 'active' : ''}`}
                onClick={() => toggleArea('civil')}
              >
                Derecho Civil
              </button>
              <button 
                type="button"
                className={`subject-btn ${selectedAreas.procesal ? 'active' : ''}`}
                onClick={() => toggleArea('procesal')}
              >
                Derecho Procesal
              </button>
              <button 
                type="button"
                className={`subject-btn ${selectedAreas.constitucional ? 'active' : ''}`}
                onClick={() => toggleArea('constitucional')}
              >
                Derecho Constitucional
              </button>
            </div>
          </div>

          {/* Submaterias Selector */}
          {activeAreas.length > 0 && (
            <div className="control-group submaterias-section">
              <button
                type="button"
                className={`subject-btn ${showSubmaterias ? 'active' : ''}`}
                onClick={() => setShowSubmaterias(!showSubmaterias)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.95rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  color: '#cbd5e1',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ⚙️ {showSubmaterias ? 'Ocultar Temas Específicos (Submaterias)' : 'Personalizar Temas Específicos (Submaterias)'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>
                  {showSubmaterias ? '▲ Ocultar' : '▼ Mostrar'}
                </span>
              </button>
              
              {showSubmaterias && (
                <div style={{
                  marginTop: '1rem',
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  animation: 'slideDown 0.3s ease'
                }}>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Todas las submaterias están activas por defecto (Evaluación Completa, máx 60 preguntas). Desmarca alguna para enfocar tu estudio (Evaluación Filtrada, máx 15 preguntas).
                  </p>
                  
                  <div className="submaterias-grid">
                    {activeAreas.map(areaKey => (
                      <div key={areaKey} className="submateria-column">
                        <h4 className="column-title">
                          {areaKey === 'civil' ? 'Derecho Civil' : areaKey === 'procesal' ? 'Derecho Procesal' : 'Derecho Constitucional'}
                        </h4>
                        <div className="submateria-list">
                          {SUB_MATERIAS[areaKey].map(sub => (
                            <label 
                              key={sub.id} 
                              className={`submateria-label ${selectedSubmaterias[sub.id] ? 'selected' : ''}`}
                            >
                              <input 
                                type="checkbox"
                                checked={!!selectedSubmaterias[sub.id]}
                                onChange={() => toggleSubmateria(sub.id, areaKey)}
                              />
                              <span>{sub.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Question Count Slider */}
          <div className="control-group">
            <label>Cantidad de Preguntas</label>
            <div className="slider-container">
              <div className="slider-val">
                <span className="slider-number">{totalQuestions}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {isFilteredMode 
                    ? `(${activeSelectedSubmaterias.length} submaterias activas)`
                    : `(${dist.civil} Civil | ${dist.procesal} Procesal | ${dist.constitucional} Const.)`
                  }
                </span>
              </div>
              <input 
                type="range" 
                min={minQuestions} 
                max={maxQuestions} 
                value={totalQuestions} 
                onChange={(e) => setTotalQuestions(parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Time limit selector */}
          <div className="control-group">
            <label>Tiempo Límite de la Evaluación</label>
            <select 
              value={timeLimit} 
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '0.85rem 1.25rem',
                color: '#f1f5f9',
                fontFamily: 'inherit',
                fontSize: '1rem',
                outline: 'none'
              }}
            >
              <option value="5">5 Minutos</option>
              <option value="15">15 Minutos</option>
              <option value="30">30 Minutos</option>
              <option value="45">45 Minutos</option>
              <option value="60">60 Minutos</option>
              <option value="90">90 Minutos</option>
              <option value="120">120 Minutos</option>
            </select>
          </div>

          {/* Correction Mode Selector */}
          <div className="control-group">
            <label>Modo de Corrección</label>
            <div className="mode-selectors">
              <div 
                className={`mode-card ${correctionMode === 'immediate' ? 'active' : ''}`}
                onClick={() => setCorrectionMode('immediate')}
              >
                <div className="mode-title">Corrección Inmediata</div>
                <p className="mode-desc">Revisa el resultado tras responder cada pregunta.</p>
              </div>
              <div 
                className={`mode-card ${correctionMode === 'deferred' ? 'active' : ''}`}
                onClick={() => setCorrectionMode('deferred')}
              >
                <div className="mode-title">Corrección al Final</div>
                <p className="mode-desc">Guarda las respuestas y revisa el informe completo al terminar.</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
            <button className="btn-primary" onClick={handleStartQuiz} style={{ width: '100%', maxWidth: '300px' }}>
              Iniciar Simulación
            </button>
          </div>

          {/* Footer with Privacy Policy */}
          <div className="footer-info">
            Plataforma interactiva para preparación de Grado.
            <div className="footer-links">
              <span className="footer-link" onClick={() => setShowPrivacy(true)}>Política de Privacidad</span>
            </div>
            <p className="footer-disclaimer">
              <strong>Aviso:</strong> Las preguntas y alternativas de este simulador fueron generadas y refinadas con el apoyo de Inteligencia Artificial. Aunque se han realizado esfuerzos por asegurar su rigurosidad legal, podrían contener imprecisiones o errores. Esta herramienta debe ser utilizada únicamente como una guía de estudio complementaria. Si encuentras algún error o inconsistencia en alguna pregunta, por favor no dudes en reportarlo utilizando el formulario de observaciones de la misma.
            </p>
            <div className="footer-bottom-row">
              <div className="dedication-column">
                <div className="dedicatoria">
                  Dedicado a Francisca Navarrete Aguilera
                </div>
                <div className="by-judex">
                  by Judex
                </div>
              </div>
              {visitCount !== null && (
                <div className="visitor-counter">
                  {visitCount.toLocaleString()} visitas
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. LOADING SCREEN */}
      {screen === 'loading' && (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{ 
            border: '4px solid rgba(99, 102, 241, 0.1)', 
            borderLeft: '4px solid var(--primary)', 
            borderRadius: '50%', 
            width: '50px', 
            height: '50px', 
            animation: 'spin 1s linear infinite', 
            margin: '0 auto 1.5rem'
          }} />
          <h2>Preparando tu cuestionario...</h2>
          <p>Obteniendo una muestra aleatoria balanceada de preguntas desde la base de datos.</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* 3. QUIZ SCREEN */}
      {screen === 'quiz' && questions.length > 0 && (
        <div>
          {/* Header Progress and Timer */}
          <div className="header-bar">
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#94a3b8' }}>
              Pregunta {currentIdx + 1} de {questions.length}
            </span>
            <div className={`timer-box ${timeLeft < 60 ? 'warning' : ''}`}>
              🕒 {formatTime(timeLeft)}
            </div>
          </div>

          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Current Question */}
          <div className="pregunta-meta" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {questions[currentIdx].area}
            </span>
            <span style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: 500 }}>
              {questions[currentIdx].tema}
              {questions[currentIdx].subtema && ` › ${questions[currentIdx].subtema}`}
            </span>
          </div>
          <h2 className="pregunta-texto">
            {questions[currentIdx].pregunta}
          </h2>

          {/* Options Grid */}
          <div className="options-grid">
            {shuffledOptions.map((opt, i) => {
              const letter = ["A", "B", "C", "D"][i]
              
              let cardClass = "option-card"
              if (selectedOpt === i) cardClass += " selected"
              
              // Styling for Immediate Correction Mode
              if (correctionMode === 'immediate' && isAnswered) {
                cardClass += " disabled"
                if (opt.isCorrect) {
                  cardClass += " correct"
                } else if (selectedOpt === i) {
                  cardClass += " incorrect"
                }
              }

              return (
                <div 
                  key={i} 
                  className={cardClass}
                  onClick={() => handleSelectOption(i)}
                >
                  <div className="option-badge">{letter}</div>
                  <div style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>{opt.text}</div>
                  
                  {/* Results labels inside options in Immediate Mode */}
                  {correctionMode === 'immediate' && isAnswered && opt.isCorrect && (
                    <span className="feedback-pill correct">Correcta</span>
                  )}
                  {correctionMode === 'immediate' && isAnswered && selectedOpt === i && !opt.isCorrect && (
                    <span className="feedback-pill incorrect">Tu selección</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Submit / Next Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
            <button className="btn-secondary" onClick={handleRestart}>
              Abandonar Test
            </button>
            
            {correctionMode === 'immediate' && !isAnswered ? (
              <button 
                className="btn-primary" 
                onClick={handleVerifyAnswer} 
                disabled={selectedOpt === null}
              >
                Comprobar
              </button>
            ) : (
              <button 
                className="btn-primary" 
                onClick={handleNextQuestion} 
                disabled={selectedOpt === null && correctionMode === 'deferred'}
              >
                {currentIdx < questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Evaluación'}
              </button>
            )}
          </div>

          {/* Immediate Feedback Box */}
          {correctionMode === 'immediate' && isAnswered && (
            <div className="feedback-box">
              <div className="feedback-header">
                📝 Reportar observaciones sobre esta pregunta
              </div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b' }}>
                Si notas algún error legal, inconsistencia o mala formulación en el enunciado o las alternativas, detállalo para mejorar el banco.
              </p>
              
              {feedbackEnviado && feedbackIdPregunta === questions[currentIdx].id ? (
                <div style={{ padding: '0.75rem', background: 'var(--success-glow)', border: '1px solid var(--success)', borderRadius: '10px', color: '#34d399', fontSize: '0.9rem', textAlign: 'center' }}>
                  ✔️ ¡Gracias! Tu retroalimentación ha sido enviada con éxito.
                </div>
              ) : (
                <div>
                  <div className="feedback-inputs">
                    <div>
                      <label style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>Sobre la Pregunta / Enunciado:</label>
                      <textarea 
                        placeholder="Ej: La norma legal cambió en la última reforma..."
                        value={feedbackPregunta}
                        onChange={(e) => setFeedbackPregunta(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>Sobre las Respuestas / Alternativas:</label>
                      <textarea 
                        placeholder="Ej: La alternativa C es verosímil pero tiene un plazo erróneo..."
                        value={feedbackRespuesta}
                        onChange={(e) => setFeedbackRespuesta(e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn-outline" 
                      onClick={() => handleSendFeedback(questions[currentIdx].id)}
                      disabled={!feedbackPregunta && !feedbackRespuesta}
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                    >
                      Enviar Reporte
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. RESULTS SCREEN */}
      {screen === 'results' && (
        <div className="results-card">
          <h1>Resultados de la Simulación</h1>
          <p className="subtitle">Resumen final del rendimiento obtenido</p>

          <div className={`score-circle ${stats.score >= 70 ? 'approved' : 'failed'}`}>
            <span className="score-num">{stats.score}</span>
            <span className="score-label">Puntos</span>
          </div>

          <div>
            {stats.score >= 70 ? (
              <span className="status-badge approved">Aprobado</span>
            ) : (
              <span className="status-badge failed">Reprobado</span>
            )}
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-val">{questions.length}</div>
              <div className="stat-lbl">Preguntas</div>
            </div>
            <div className="stat-item" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
              <div className="stat-val" style={{ color: '#34d399' }}>{stats.correct}</div>
              <div className="stat-lbl">Correctas</div>
            </div>
            <div className="stat-item" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <div className="stat-val" style={{ color: '#f87171' }}>{stats.incorrect}</div>
              <div className="stat-lbl">Incorrectas</div>
            </div>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2.5rem' }}>
            {stats.score >= 70 
              ? "🎉 ¡Excelente trabajo! Has superado el umbral requerido del 70%. Estás bien preparado para afrontar estas materias en tu examen oral."
              : "📚 Te sugerimos repasar los temas fallidos. Recuerda que el examen de grado requiere un dominio legal de alta precisión."
            }
          </p>

          {/* Review Panel for Both Modes */}
          <div className="review-section">
            <h2>Revisión de Preguntas y Feedback</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Revisa las alternativas correctas y envía tus observaciones sobre cada pregunta si detectas errores conceptuales.
            </p>

            {questions.map((q, idx) => {
              const ans = userAnswers[idx] || { selectedIndex: null, isCorrect: false, options: [] }
              const correctText = q.respuesta_correcta
              const userSelectedText = ans.selectedIndex !== null && ans.options[ans.selectedIndex] 
                ? ans.options[ans.selectedIndex].text 
                : "Sin respuesta"

              return (
                <div key={idx} className="review-item">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Pregunta {idx + 1} &bull; {q.area}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
                      {q.tema} {q.subtema && `› ${q.subtema}`}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#f1f5f9', fontSize: '1.05rem', fontWeight: 600 }}>
                    {q.pregunta}
                  </h4>

                  {/* User selection display */}
                  <div className={`review-answer ${ans.isCorrect ? 'correct' : 'incorrect'}`}>
                    <strong>Tu Respuesta:</strong> {userSelectedText}
                  </div>

                  {/* Correct response display if user was wrong */}
                  {!ans.isCorrect && (
                    <div className="review-answer correct" style={{ marginTop: '0.5rem' }}>
                      <strong>Respuesta Correcta:</strong> {correctText}
                    </div>
                  )}

                  {/* Feedback Form for each question in results screen */}
                  <FeedbackForm questionId={q.id} anonUserId={anonUserId} />
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem' }}>
            <button className="btn-primary" onClick={handleRestart}>
              Nueva Simulación
            </button>
          </div>
        </div>
      )}

      {/* 5. PRIVACY MODAL */}
      {showPrivacy && (
        <div className="modal-overlay" onClick={() => setShowPrivacy(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Política de Privacidad</div>
            <div className="modal-body">
              <p>
                Valoramos la privacidad de los estudiantes y usuarios de este portal de estudio. Es por ello que garantizamos el siguiente tratamiento de datos:
              </p>
              <h4 style={{ color: '#f1f5f9', margin: '1rem 0 0.5rem' }}>1. No recopilamos datos personales</h4>
              <p style={{ fontSize: '0.9rem' }}>
                Esta aplicación no requiere ningún tipo de registro, correo electrónico, nombre o datos de perfil para ser utilizada de forma libre.
              </p>
              <h4 style={{ color: '#f1f5f9', margin: '1rem 0 0.5rem' }}>2. Anonimización del reporte de feedbacks</h4>
              <p style={{ fontSize: '0.9rem' }}>
                Para evitar el spam o reportes maliciosos en la base de datos de preguntas, cuando envías feedback sobre alguna pregunta o alternativa, el sistema consulta tu dirección IP de manera externa y genera una cadena de caracteres única (hash irreversible), por ejemplo: <code>anon_923847293</code>.
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Tu dirección IP real <strong>no se almacena</strong> en nuestras bases de datos de Supabase en ningún momento; solo se registra el hash para validar el límite de reportes por sesión.
              </p>
              <h4 style={{ color: '#f1f5f9', margin: '1rem 0 0.5rem' }}>3. Almacenamiento local</h4>
              <p style={{ fontSize: '0.9rem' }}>
                Las variables de sesión temporales se guardan localmente en tu propio dispositivo (Local Storage) y se eliminan al vaciar la caché de tu navegador.
              </p>
            </div>
            <div className="modal-close">
              <button className="btn-primary" onClick={() => setShowPrivacy(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
