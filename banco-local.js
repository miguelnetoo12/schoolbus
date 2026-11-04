/* =====================================================================
   SchoolBus – Banco de dados local
   ---------------------------------------------------------------------
   Guarda tudo no localStorage do navegador, com a mesma forma de uso
   do banco do Claude (coleções e documentos):

     BancoLocal.collection("alunos").doc("id").set({...})
     BancoLocal.doc("config/geral").onSnapshot(snap => ...)

   Os dados ficam só neste navegador e neste computador.
   Para levar para outro computador, use "Exportar backup" na página
   Acesso e privacidade e depois "Importar backup" no outro.
   ===================================================================== */
(function () {
  "use strict";

  const CHAVE = "schoolbus_banco_v1";
  let dados = carregar();
  const ouvintes = new Set(); // funções chamadas sempre que algo muda

  function carregar() {
    try {
      const txt = localStorage.getItem(CHAVE);
      if (txt) return JSON.parse(txt);
    } catch (e) { /* armazenamento bloqueado ou corrompido */ }
    return clonar(window.SCHOOLBUS_DADOS_INICIAIS || {});
  }
  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(dados)); }
    catch (e) { throw { code: "quota_exceeded", message: "Sem espaço no navegador para salvar." }; }
    avisar();
  }
  function avisar() { setTimeout(() => ouvintes.forEach(fn => { try { fn(); } catch (e) { console.error(e); } }), 0); }
  function clonar(o) { return JSON.parse(JSON.stringify(o)); }
  function novoId() {
    const a = "abcdefghijklmnopqrstuvwxyz0123456789"; let s = "";
    const r = new Uint32Array(20); crypto.getRandomValues(r);
    r.forEach(x => (s += a[x % a.length])); return s;
  }
  function partes(caminho) { return String(caminho).split("/").filter(Boolean); }
  function mesclar(alvo, novo) {
    for (const k of Object.keys(novo)) {
      const v = novo[k];
      if (v && typeof v === "object" && !Array.isArray(v) && alvo[k] && typeof alvo[k] === "object" && !Array.isArray(alvo[k])) mesclar(alvo[k], v);
      else alvo[k] = clonar(v);
    }
    return alvo;
  }
  const META = { fromCache: false, hasPendingWrites: false };
  function snapDoc(id, corpo) {
    const existe = corpo !== undefined;
    const copia = existe ? Object.freeze(clonar(corpo)) : undefined;
    return { id, exists: existe, data: () => copia, metadata: META };
  }

  /* ---------- documento ---------- */
  function docRef(col, id) {
    const caminho = col + "/" + id;
    return {
      id, path: caminho,
      async get() { return snapDoc(id, (dados[col] || {})[id]); },
      async set(corpo) {
        if (!corpo || typeof corpo !== "object" || Array.isArray(corpo)) throw { code: "invalid_argument", message: "O documento precisa ser um objeto." };
        (dados[col] = dados[col] || {})[id] = clonar(corpo); salvar();
      },
      async update(corpo) {
        const atual = (dados[col] || {})[id];
        if (!atual) throw { code: "invalid_argument", message: "Documento não existe: " + caminho };
        mesclar(atual, corpo); salvar();
      },
      async delete() { if (dados[col]) { delete dados[col][id]; salvar(); } },
      onSnapshot(prox, erro) {
        let ultimo = null;
        const disparar = () => {
          const corpo = (dados[col] || {})[id]; const txt = JSON.stringify(corpo);
          if (txt === ultimo) return; ultimo = txt;
          prox(snapDoc(id, corpo));
        };
        ouvintes.add(disparar); setTimeout(disparar, 0);
        return () => ouvintes.delete(disparar);
      },
      collection() { throw new TypeError("Subcoleções não são usadas no SchoolBus."); }
    };
  }

  /* ---------- consulta ---------- */
  const OPS = {
    "==": (a, b) => a === b, "!=": (a, b) => a !== b,
    "<": (a, b) => a < b, "<=": (a, b) => a <= b, ">": (a, b) => a > b, ">=": (a, b) => a >= b,
    "in": (a, b) => Array.isArray(b) && b.includes(a), "not-in": (a, b) => Array.isArray(b) && !b.includes(a),
    "array-contains": (a, b) => Array.isArray(a) && a.includes(b)
  };
  function consulta(col, filtros = [], ordem = null, limite = 0) {
    function executar() {
      let lista = Object.entries(dados[col] || {}).map(([id, corpo]) => ({ id, corpo }));
      for (const [campo, op, valor] of filtros) lista = lista.filter(x => (OPS[op] || (() => true))(x.corpo[campo], valor));
      if (ordem) {
        const [campo, dir] = ordem, m = dir === "desc" ? -1 : 1;
        lista.sort((a, b) => {
          const x = a.corpo[campo], y = b.corpo[campo];
          if (x === undefined) return 1; if (y === undefined) return -1;
          return (x > y ? 1 : x < y ? -1 : 0) * m;
        });
      } else lista.sort((a, b) => (a.id > b.id ? 1 : -1));
      if (limite) lista = lista.slice(0, limite);
      return lista;
    }
    function montar(lista, anteriores) {
      const docs = lista.map(x => snapDoc(x.id, x.corpo));
      const mudancas = () => {
        if (!anteriores) return docs.map((d, i) => ({ type: "added", doc: d, oldIndex: -1, newIndex: i }));
        const out = [];
        docs.forEach((d, i) => {
          if (!anteriores.has(d.id)) out.push({ type: "added", doc: d, oldIndex: -1, newIndex: i });
          else if (anteriores.get(d.id) !== JSON.stringify(d.data())) out.push({ type: "modified", doc: d, oldIndex: -1, newIndex: i });
        });
        anteriores.forEach((txt, id) => { if (!lista.some(x => x.id === id)) out.push({ type: "removed", doc: snapDoc(id, JSON.parse(txt)), oldIndex: -1, newIndex: -1 }); });
        return out;
      };
      return { docs, size: docs.length, empty: !docs.length, metadata: META, docChanges: mudancas };
    }
    return {
      where: (campo, op, valor) => consulta(col, [...filtros, [campo, op, valor]], ordem, limite),
      orderBy: (campo, dir = "asc") => consulta(col, filtros, [campo, dir], limite),
      limit: n => consulta(col, filtros, ordem, n),
      async get() { return montar(executar(), null); },
      onSnapshot(prox, erro) {
        let anteriores = null, ultimo = null;
        const disparar = () => {
          const lista = executar(); const txt = JSON.stringify(lista);
          if (txt === ultimo) return; ultimo = txt;
          const snap = montar(lista, anteriores);
          anteriores = new Map(lista.map(x => [x.id, JSON.stringify(x.corpo)]));
          prox(snap);
        };
        ouvintes.add(disparar); setTimeout(disparar, 0);
        return () => ouvintes.delete(disparar);
      }
    };
  }
  function colRef(col) {
    const q = consulta(col);
    return Object.assign(q, {
      path: col,
      doc: id => docRef(col, id || novoId()),
      async add(corpo) { const r = docRef(col, novoId()); await r.set(corpo); return r; }
    });
  }

  /* ---------- API pública ---------- */
  window.BancoLocal = {
    collection(caminho) {
      const p = partes(caminho);
      if (p.length !== 1) throw new TypeError("Use coleções de um nível, ex.: 'alunos'.");
      return colRef(p[0]);
    },
    doc(caminho) {
      const p = partes(caminho);
      if (p.length !== 2) throw new TypeError("Use 'colecao/id', ex.: 'config/geral'.");
      return docRef(p[0], p[1]);
    },
    /* Backup e restauração */
    exportar() { return clonar(dados); },
    importar(obj) {
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) throw new Error("Arquivo de backup inválido.");
      dados = clonar(obj); salvar();
    },
    restaurarIniciais() { dados = clonar(window.SCHOOLBUS_DADOS_INICIAIS || {}); salvar(); }
  };

  // Mantém várias abas do mesmo navegador sincronizadas
  window.addEventListener("storage", e => { if (e.key === CHAVE) { dados = carregar(); avisar(); } });
})();
