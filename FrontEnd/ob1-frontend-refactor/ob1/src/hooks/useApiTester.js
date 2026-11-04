import { useRef, useState } from "react";
import { PASSWORD, SESSION_KEY, DEFAULT_API_BASE } from "../config";
import { loadTestAccount, redact, buildApiUrl } from "../utils";

const EMPTY_OUTPUT = "La respuesta de cada consulta aparecerá acá.";
const EMPTY_LAST = "Todavía no se hicieron solicitudes";

/**
 * Toda la lógica de la consola: sesiones, llamadas a la API, historial y
 * las acciones de cada botón. Los componentes solo muestran lo que este
 * hook devuelve y llaman a `run("nombre-de-accion")`.
 */
export function useApiTester() {
  // --- Estado visible en la interfaz ---
  const [account] = useState(loadTestAccount);
  const [username, setUsername] = useState(account.username);
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);
  const [userActive, setUserActive] = useState(false);
  const [adminActive, setAdminActive] = useState(false);
  const [adminIdentifier, setAdminIdentifier] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUserId, setAdminUserId] = useState("");
  const [genres, setGenres] = useState(null); // null = todavía no se consultó
  const [genreId, setGenreId] = useState("");
  const [trackQuery, setTrackQuery] = useState("Bohemian Rhapsody");
  const [coverFile, setCoverFile] = useState(null);
  const [output, setOutput] = useState(EMPTY_OUTPUT);
  const [lastRequest, setLastRequest] = useState(EMPTY_LAST);
  const [history, setHistory] = useState([]);

  // --- Estado interno (tokens e IDs): no necesita re-renderizar ---
  const s = useRef({
    token: "",
    adminToken: "",
    email: account.email,
    currentUserId: "",
    genreId: "",
    testGenreId: "",
    playlistId: "",
    trackId: "",
    playlistIds: [],
    isPremium: false,
    historyId: 0,
  }).current;

  const selectGenre = (id) => {
    s.genreId = id;
    setGenreId(id);
  };

  const setCurrentUserId = (id) => {
    s.currentUserId = id;
    setAdminUserId(id);
  };

  // --- Registro de respuestas ---
  const showResponse = (method, path, status, payload, ok) => {
    const time = new Date().toLocaleTimeString();
    setLastRequest(`${time} · ${method} ${path} · HTTP ${status}`);
    setOutput(JSON.stringify(redact(payload), null, 2));
    setHistory((prev) => [
      { id: ++s.historyId, method, path, status, ok, time },
      ...prev,
    ]);
  };

  const resetOutput = () => {
    setOutput(EMPTY_OUTPUT);
    setLastRequest(EMPTY_LAST);
    setHistory([]);
  };

  // --- Cliente HTTP ---
  const request = async (
    method,
    path,
    { body, auth = "user", formData, expectedStatuses = [], mustReturnStatus } = {},
  ) => {
    const token =
      auth === "admin" ? s.adminToken : auth === "none" ? "" : s.token;

    if (auth !== "none" && !token) {
      throw new Error(
        auth === "admin"
          ? "Iniciá sesión como administrador antes de usar este endpoint."
          : "Primero registrá el usuario de prueba e iniciá sesión.",
      );
    }

    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers["Content-Type"] = "application/json";

    let response;
    let payload;
    try {
      response = await fetch(buildApiUrl(apiBase, path), {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : formData || undefined,
      });
      const text = await response.text();
      if (text) {
        try {
          payload = JSON.parse(text);
        } catch {
          payload = text;
        }
      } else {
        payload = { message: "Sin contenido (respuesta válida)." };
      }
    } catch (error) {
      showResponse(
        method,
        path,
        "sin respuesta",
        {
          message:
            error.message ||
            "No fue posible conectar. Revisá que la API esté levantada y que CORS permita este origen.",
        },
        false,
      );
      throw error;
    }

    const ok =
      (mustReturnStatus === undefined && response.ok) ||
      expectedStatuses.includes(response.status) ||
      response.status === mustReturnStatus;
    showResponse(method, path, response.status, payload, ok);

    if (!ok) {
      const error = new Error(
        payload?.message ||
          payload?.error ||
          `La solicitud falló con HTTP ${response.status}.`,
      );
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  };

  // --- Validaciones ---
  const requireGenre = () => {
    if (!s.genreId) throw new Error("Consultá los géneros y seleccioná uno primero.");
    return s.genreId;
  };

  const requirePlaylist = () => {
    if (!s.playlistId) throw new Error("Primero creá una playlist de prueba.");
    return s.playlistId;
  };

  // --- Flujo compuesto: límite del plan Plus ---
  const testPlusLimit = async () => {
    if (s.isPremium) {
      throw new Error(
        "La cuenta ya está en Premium. Registrá otro usuario de prueba para probar el límite Plus.",
      );
    }
    const genre = requireGenre();
    const usage = await request("GET", "/users/me/usage");
    let used = usage.data?.used;

    if (!Number.isInteger(used)) {
      throw new Error("La API no devolvió el contador de uso esperado.");
    }
    if (used > 4) {
      throw new Error(
        `La cuenta ya tiene ${used} playlists (más del límite Plus). Usá una cuenta temporal nueva.`,
      );
    }

    while (used < 4) {
      const created = await request("POST", "/playlists", {
        body: {
          name: `Hito1 límite ${used + 1} ${Date.now().toString(36)}`,
          description: "Playlist temporal para probar el límite Plus.",
          genre,
          isPublic: true,
        },
      });
      const id = created.data?.playlist?.id || created.data?.playlist?._id;
      if (!id) throw new Error("La API no devolvió el ID de la playlist.");
      s.playlistIds.push(id);
      s.playlistId = id;
      used += 1;
    }

    const fifthAttempt = await request("POST", "/playlists", {
      body: {
        name: `Hito1 quinta ${Date.now().toString(36)}`,
        description: "Esta creación debería ser rechazada en Plus.",
        genre,
        isPublic: true,
      },
      mustReturnStatus: 403,
    });

    return {
      message:
        "Prueba de límite ejecutada. Se reservaron 4 playlists de prueba; la quinta debe dar 403. Después podés subir el plan y crear otra.",
      used: 4,
      limit: 4,
      fifthPlaylistAttempt: fifthAttempt,
    };
  };

  // --- Una función por acción de botón ---
  const actions = {
    // Conexión y sesiones
    health: () => request("GET", "/health", { auth: "none" }),

    register: () =>
      request("POST", "/auth/register", {
        auth: "none",
        body: { username, email: s.email, password: PASSWORD },
      }),

    login: async () => {
      const result = await request("POST", "/auth/login", {
        auth: "none",
        body: { identifier: username, password: PASSWORD },
      });
      s.token = result.token;
      if (result.data?.user?.id) setCurrentUserId(result.data.user.id);
      s.isPremium = result.data?.user?.plan === "premium";
      setUserActive(Boolean(s.token));
      return result;
    },

    me: async () => {
      const result = await request("GET", "/auth/me");
      if (result.data?.user?.id) setCurrentUserId(result.data.user.id);
      return result;
    },

    logout: () => {
      s.token = "";
      s.currentUserId = "";
      setUserActive(false);
      setOutput(
        "Sesión de usuario cerrada localmente. El JWT ya no se enviará en las próximas solicitudes.",
      );
    },

    "admin-login": async () => {
      const result = await request("POST", "/auth/login", {
        auth: "none",
        body: { identifier: adminIdentifier.trim(), password: adminPassword },
      });
      s.adminToken = result.token;
      setAdminPassword("");
      setAdminActive(Boolean(s.adminToken));
      return result;
    },

    "admin-logout": () => {
      s.adminToken = "";
      setAdminActive(false);
      setOutput("Sesión admin cerrada localmente. El JWT ya no se enviará.");
    },

    // Géneros
    "genres-list": async () => {
      const result = await request("GET", "/genres");
      const list = result.data?.genres || [];
      setGenres(list);
      selectGenre(list.length ? list[0].id || list[0]._id : "");
      return result;
    },

    "genre-get": () => {
      if (!s.genreId) throw new Error("Primero consultá la lista de géneros.");
      return request("GET", `/genres/${encodeURIComponent(s.genreId)}`);
    },

    "genre-create": async () => {
      const result = await request("POST", "/genres", {
        auth: "admin",
        body: {
          name: `Hito1-${Date.now().toString(36)}`,
          description: "Género temporal creado desde las pruebas AJAX.",
        },
      });
      s.testGenreId = result.data?.genre?.id || result.data?.genre?._id || "";
      if (s.testGenreId && !s.genreId) s.genreId = s.testGenreId;
      return result;
    },

    "genre-update": () => {
      if (!s.testGenreId) throw new Error("Primero creá un género de prueba con admin.");
      return request("PATCH", `/genres/${s.testGenreId}`, {
        auth: "admin",
        body: { description: "Descripción actualizada desde Hito 1." },
      });
    },

    "genre-delete": async () => {
      if (!s.testGenreId) {
        throw new Error("Solo se permite borrar el género creado por esta página.");
      }
      if (!confirm("¿Eliminar el género temporal de esta prueba?")) return;
      const result = await request("DELETE", `/genres/${s.testGenreId}`, {
        auth: "admin",
        expectedStatuses: [204],
      });
      s.testGenreId = "";
      return result;
    },

    // Playlists
    "playlist-create": async () => {
      const result = await request("POST", "/playlists", {
        body: {
          name: `Hito1 Playlist ${new Date().toLocaleString("es-UY")}`,
          description: "Playlist de demostración generada desde Hito 1.",
          genre: requireGenre(),
          isPublic: true,
        },
      });
      s.playlistId = result.data?.playlist?.id || result.data?.playlist?._id || "";
      if (s.playlistId) s.playlistIds.push(s.playlistId);
      return result;
    },

    "playlists-list": () => request("GET", "/playlists?page=1&limit=10"),

    "playlists-filter": () => {
      const params = new URLSearchParams({
        genre: requireGenre(),
        search: "Hito1",
        page: "1",
        limit: "10",
      });
      return request("GET", `/playlists?${params}`);
    },

    "playlist-get": () => request("GET", `/playlists/${requirePlaylist()}`),

    "playlist-update": () =>
      request("PATCH", `/playlists/${requirePlaylist()}`, {
        body: { description: "Descripción editada con la prueba de Hito 1." },
      }),

    "playlist-delete": async () => {
      if (!confirm("¿Eliminar la playlist de prueba seleccionada?")) return;
      const result = await request("DELETE", `/playlists/${requirePlaylist()}`, {
        expectedStatuses: [204],
      });
      s.playlistIds = s.playlistIds.filter((id) => id !== s.playlistId);
      s.playlistId = "";
      s.trackId = "";
      return result;
    },

    "playlist-cleanup": async () => {
      const listed = await request("GET", "/playlists?page=1&limit=100");
      const testPlaylists = (listed.data?.playlists || []).filter(
        (p) => p.name?.startsWith("Hito1 ") || p.name?.includes("Hito 1"),
      );
      if (!testPlaylists.length) {
        throw new Error("No se encontraron playlists identificadas como datos de Hito 1.");
      }
      if (
        !confirm(
          `Se eliminarán ${testPlaylists.length} playlists con nombre de prueba Hito 1. ¿Continuar?`,
        )
      ) {
        return;
      }
      for (const playlist of testPlaylists) {
        await request("DELETE", `/playlists/${playlist.id || playlist._id}`, {
          expectedStatuses: [204],
        });
      }
      s.playlistIds = [];
      s.playlistId = "";
      s.trackId = "";
      return {
        message: "Se eliminaron las playlists de prueba listadas.",
        deleted: testPlaylists.length,
      };
    },

    // Plan
    usage: () => request("GET", "/users/me/usage"),

    upgrade: async () => {
      if (
        !confirm(
          "Esto cambia la cuenta temporal a Premium y no puede revertirse desde la API. ¿Continuar?",
        )
      ) {
        return;
      }
      const result = await request("PATCH", "/users/me/upgrade-plan", {
        body: {},
        expectedStatuses: [400],
      });
      if (result.data?.plan === "premium") s.isPremium = true;
      return result;
    },

    "plan-limit": testPlusLimit,

    // Pistas, imagen e IA
    "track-search": () => {
      const query = trackQuery.trim();
      if (!query) throw new Error("Escribí un término para buscar pistas.");
      return request("GET", `/tracks/search?${new URLSearchParams({ q: query })}`);
    },

    "track-add": async () => {
      const result = await request("POST", `/playlists/${requirePlaylist()}/tracks`, {
        body: {
          title: "Bohemian Rhapsody",
          artist: "Queen",
          album: "A Night at the Opera",
          durationMs: 354000,
          previewUrl: "",
          artworkUrl: "",
        },
      });
      const tracks = result.data?.playlist?.tracks || [];
      const added = tracks[tracks.length - 1];
      s.trackId = added?.id || added?._id || "";
      return result;
    },

    "track-remove": async () => {
      if (!s.trackId) throw new Error("Primero agregá la pista de demostración.");
      const result = await request(
        "DELETE",
        `/playlists/${requirePlaylist()}/tracks/${s.trackId}`,
        { expectedStatuses: [200] },
      );
      s.trackId = "";
      return result;
    },

    "cover-upload": () => {
      if (!coverFile) throw new Error("Elegí un archivo de imagen primero.");
      if (!coverFile.type.startsWith("image/")) {
        throw new Error("El archivo seleccionado no es una imagen.");
      }
      if (coverFile.size > 5 * 1024 * 1024) {
        throw new Error("La imagen debe pesar 5 MB o menos.");
      }
      const formData = new FormData();
      formData.append("image", coverFile);
      return request("POST", `/playlists/${requirePlaylist()}/cover-image`, { formData });
    },

    vibe: () =>
      request("POST", `/playlists/${requirePlaylist()}/generate-vibe`, { body: {} }),

    // Mi usuario y administración
    "profile-update": async () => {
      const result = await request("PATCH", "/users/me", {
        body: { username: `${username}edit`.slice(0, 30) },
      });
      const next = result.data?.user?.username || username;
      setUsername(next);
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ username: next, email: s.email }),
      );
      return result;
    },

    "admin-users": () => request("GET", "/users?page=1&limit=10", { auth: "admin" }),

    "admin-user-get": () => {
      const id = adminUserId.trim();
      if (!id) throw new Error("Ingresá un ID de usuario.");
      return request("GET", `/users/${encodeURIComponent(id)}`, { auth: "admin" });
    },

    "admin-user-delete": () => {
      const id = adminUserId.trim();
      if (!id) throw new Error("Ingresá el ID de la cuenta que vas a borrar.");
      if (
        !confirm(`Esto eliminará al usuario ${id} y todas sus playlists. ¿Continuar?`)
      ) {
        return;
      }
      return request("DELETE", `/users/${encodeURIComponent(id)}`, {
        auth: "admin",
        expectedStatuses: [204],
      });
    },

    "delete-me": async () => {
      if (
        !confirm(
          "Esto eliminará la cuenta temporal y todas sus playlists. Esta acción es irreversible. ¿Continuar?",
        )
      ) {
        return;
      }
      const result = await request("DELETE", "/users/me", { expectedStatuses: [204] });
      s.token = "";
      s.currentUserId = "";
      setUserActive(false);
      return result;
    },
  };

  // Ejecuta una acción y muestra su resultado o su error.
  const run = async (action) => {
    const handler = actions[action];
    try {
      if (!handler) throw new Error(`Acción desconocida: ${action}`);
      const result = await handler();
      if (result !== undefined) {
        setOutput(JSON.stringify(redact(result), null, 2));
      }
    } catch (error) {
      // Los errores HTTP ya se mostraron en showResponse.
      if (!error.status) {
        setOutput(
          JSON.stringify({ error: error.message || "Error inesperado." }, null, 2),
        );
      }
    }
  };

  return {
    run, resetOutput,
    apiBase, setApiBase,
    username, userActive, adminActive,
    adminIdentifier, setAdminIdentifier,
    adminPassword, setAdminPassword,
    adminUserId, setAdminUserId,
    genres, genreId, selectGenre,
    trackQuery, setTrackQuery,
    setCoverFile,
    output, lastRequest, history,
  };
}
