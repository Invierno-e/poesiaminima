import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Download, Moon, Sun, Trash2, Plus, PenTool, Hash, Type } from 'lucide-react';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeExercise, setActiveExercise] = useState('haiku');
  const [poetryText, setPoetryText] = useState('');
  const [anthology, setAnthology] = useState([]);
  const [spark, setSpark] = useState({ noun: 'Acero', adj: 'Líquido' });

  // List of nouns and adjectives for the Spark Generator
  const nouns = ['Sombra', 'Rayo', 'Silencio', 'Acero', 'Humo', 'Espejo', 'Viento', 'Piedra', 'Grito', 'Sueño', 'Mar', 'Fuego', 'Sangre', 'Vértigo', 'Abismo', 'Latido', 'Ceniza', 'Raíz', 'Alba', 'Ocaso'];
  const adjs = ['Líquido', 'Sordo', 'Fugaz', 'Rígido', 'Ciego', 'Inmóvil', 'Etéreo', 'Crujiente', 'Gélido', 'Vivo', 'Etéreo', 'Radiante', 'Oscuro', 'Amargo', 'Dulce', 'Eterno', 'Breve', 'Salvaje', 'Infinito', 'Tímido'];


  const [acrosticWord, setAcrosticWord] = useState('POESIA');
  const [blackoutText, setBlackoutText] = useState('En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.');
  const [blackedOutIndices, setBlackedOutIndices] = useState([]);

  // Simple syllable counter for Spanish (simplified)
  const countSyllables = (text) => {
    if (!text) return 0;
    text = text.toLowerCase().trim();
    if (text.length <= 3) return 1;
    // Regex for basic Spanish syllable estimation
    const vowels = 'aeiouáéíóúü';
    let count = 0;
    let isPrevVowel = false;
    for (let char of text) {
      if (vowels.includes(char)) {
        if (!isPrevVowel) count++;
        isPrevVowel = true;
      } else {
        isPrevVowel = false;
      }
    }
    return count || 1;
  };

  const getLineSyllables = (text) => {
    const lines = text.split('\n');
    return lines.map(line => {
      const words = line.split(/\s+/).filter(w => w);
      return words.reduce((acc, word) => acc + countSyllables(word), 0);
    });
  };

  const toggleBlackout = (index) => {
    if (blackedOutIndices.includes(index)) {
      setBlackedOutIndices(blackedOutIndices.filter(i => i !== index));
    } else {
      setBlackedOutIndices([...blackedOutIndices, index]);
    }
  };

  const generateSpark = () => {
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomAdj = adjs[Math.floor(Math.random() * adjs.length)];
    setSpark({ noun: randomNoun, adj: randomAdj });
  };

  const saveToAnthology = (customText) => {
    const textToSave = customText || poetryText;
    if (!textToSave.trim()) return;
    const newPoem = {
      id: Date.now(),
      text: textToSave,
      date: new Date().toLocaleString(),
      type: activeExercise
    };
    setAnthology([newPoem, ...anthology]);
    if (!customText) setPoetryText('');
  };

  const downloadPoem = (text) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "poema.txt";
    document.body.appendChild(element);
    element.click();
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const lineSyllables = getLineSyllables(poetryText);

  return (
    <div className={`min-h-screen font-mono flex flex-col md:flex-row p-4 md:p-8 gap-8 bg-white dark:bg-[#1a1a1a] transition-colors`}>
      {/* Sidebar */}
      <aside className="w-full md:w-80 flex flex-col gap-6">
        <div className="brutal-card bg-yellow-400">
          <h1 className="font-black text-3xl leading-none mb-2 text-black uppercase">Laboratorio Poético</h1>
          <p className="text-xs uppercase font-bold text-black border-t-2 border-black pt-2">Brutalismo Literario v1.0</p>
        </div>

        {/* Spark Generator */}
        <div className="brutal-card bg-cyan-400">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-black" />
            <h2 className="font-black uppercase text-black">Generador de Chispas</h2>
          </div>
          <div className="bg-white border-4 border-black p-6 mb-4 flex flex-col items-center transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-3xl font-black text-black uppercase mb-1 tracking-tighter">{spark.noun}</span>
            <span className="text-3xl font-black text-white bg-black px-2 uppercase tracking-widest">{spark.adj}</span>
          </div>
          <button 
            onClick={generateSpark}
            className="w-full brutal-button bg-white text-black hover:bg-black hover:text-white"
          >
            Randomizar
          </button>
        </div>

        {/* Exercises Selector */}
        <div className="brutal-card bg-rose-500">
          <h2 className="font-black uppercase mb-4 text-white">Ejercicios</h2>
          <div className="flex flex-col gap-2">
            {[
              { id: 'haiku', label: 'Haiku', icon: <Hash className="w-4 h-4" /> },
              { id: 'acrostic', label: 'Acróstico', icon: <Type className="w-4 h-4" /> },
              { id: 'metaphor', label: 'Metáfora', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'blackout', label: 'Blackout', icon: <PenTool className="w-4 h-4" /> }
            ].map(ex => (
              <button
                key={ex.id}
                onClick={() => {
                  setActiveExercise(ex.id);
                  setPoetryText('');
                }}
                className={`flex items-center gap-3 p-3 border-4 border-black transition-all ${activeExercise === ex.id ? 'bg-black text-white' : 'bg-white text-black translate-x-1 translate-y-1'}`}
              >
                {ex.icon}
                <span className="font-bold uppercase text-sm">{ex.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="brutal-card flex justify-center gap-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 border-4 border-black bg-white text-black hover:bg-black hover:text-white transition-all"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col gap-6">
        <div className="brutal-card flex-1 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black uppercase flex items-center gap-2">
              {activeExercise === 'haiku' && 'Exploración: Haiku (5-7-5)'}
              {activeExercise === 'acrostic' && 'Exploración: Acróstico'}
              {activeExercise === 'metaphor' && 'Exploración: Metáfora'}
              {activeExercise === 'blackout' && 'Exploración: Blackout Poetry'}
            </h2>
          </div>

          {activeExercise === 'acrostic' && (
            <div className="mb-4 flex items-center gap-4">
              <span className="font-black uppercase text-sm">Palabra Clave:</span>
              <input 
                value={acrosticWord}
                onChange={(e) => setAcrosticWord(e.target.value.toUpperCase())}
                className="brutal-input py-1 px-4 w-40"
              />
            </div>
          )}

          <div className="flex-1 flex gap-4">
            {activeExercise === 'acrostic' && (
              <div className="flex flex-col font-black text-4xl text-cyan-500/30 select-none pt-4">
                {acrosticWord.split('').map((char, i) => (
                  <div key={i} className="h-[1.625em] flex items-center justify-center border-r-2 border-cyan-500/20 pr-4">
                    {char}
                  </div>
                ))}
              </div>
            )}

            {activeExercise !== 'blackout' ? (
              <textarea
                value={poetryText}
                onChange={(e) => setPoetryText(e.target.value)}
                placeholder={
                  activeExercise === 'haiku' ? "Escribe 3 versos (5, 7 y 5 sílabas)..." : 
                  activeExercise === 'acrostic' ? "Escribe cada verso empezando con la letra correspondiente..." :
                  "Escribe aquí tu creación..."
                }
                className="flex-1 brutal-input text-xl font-serif leading-relaxed resize-none p-4"
              />
            ) : (
              <div className="flex-1 brutal-input text-xl font-serif leading-[2] p-8 overflow-y-auto bg-white">
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {blackoutText.split(' ').map((word, i) => (
                    <span 
                      key={i}
                      onClick={() => toggleBlackout(i)}
                      className={`cursor-pointer px-1 transition-colors ${blackedOutIndices.includes(i) ? 'bg-black text-black' : 'hover:bg-cyan-200'}`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <button 
              onClick={() => {
                if (activeExercise === 'blackout') {
                  const savedText = blackoutText.split(' ').map((word, i) => blackedOutIndices.includes(i) ? '█'.repeat(word.length) : word).join(' ');
                  saveToAnthology(savedText);
                } else {
                  saveToAnthology();
                }
              }} 
              className="brutal-button flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Guardar en Antología
            </button>
            
            <div className="ml-auto flex flex-col md:flex-row gap-4 text-xs font-black uppercase items-end">
              {activeExercise === 'haiku' && (
                <div className="flex gap-2">
                  {lineSyllables.map((s, i) => (
                    <div key={i} className={`p-2 border-2 border-black ${[5, 7, 5][i] === s ? 'bg-green-400' : 'bg-black text-white'}`}>
                      L{i+1}: {s}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <div className="bg-black text-white p-2 border-2 border-black">
                  Versos: {poetryText.split('\n').filter(x => x).length}
                </div>
                <div className="bg-black text-white p-2 border-2 border-black">
                  Chars: {poetryText.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Anthology Section */}
        {anthology.length > 0 && (
          <div className="brutal-card bg-[#f0f0f0] dark:bg-[#222]">
            <h2 className="font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">Tu Antología</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {anthology.map(poem => (
                <div key={poem.id} className="bg-white dark:bg-[#333] border-4 border-black p-6 flex flex-col relative group shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-active transition-all">
                  <div className="text-[10px] font-black uppercase text-rose-500 mb-2 border-b-2 border-rose-200 pb-1">{poem.type} - {poem.date}</div>
                  <p className="font-serif italic text-lg mb-6 whitespace-pre-wrap leading-relaxed">{poem.text}</p>
                  <div className="mt-auto flex gap-2">
                    <button onClick={() => downloadPoem(poem.text)} title="Descargar .txt" className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={() => setAnthology(anthology.filter(p => p.id !== poem.id))} title="Eliminar" className="p-2 border-2 border-black hover:bg-rose-500 hover:text-white transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};


export default App;
