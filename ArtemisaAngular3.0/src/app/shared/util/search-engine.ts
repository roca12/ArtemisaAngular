/**
 * Motor de búsqueda para calcular la relevancia de los términos de consulta frente a candidatos.
 * Utiliza múltiples capas de scoring: prefijos, coincidencias exactas, n-gramas (Dice) y distancia Levenshtein.
 */
export class SearchEngine {
  // ─── Utilidades internas ─────────────────────────────────────────────────

  /**
   * Divide un texto en tokens basados en espacios y caracteres especiales.
   * @param texto El texto a tokenizar.
   * @returns Un arreglo de strings con los tokens en minúsculas.
   * @private
   */
  private static tokenizar(texto: string): string[] {
    return texto
      .toLowerCase()
      .split(/[\s\-_\/]+/)
      .filter(Boolean);
  }

  /**
   * Genera un conjunto de trigramas para un texto dado.
   * @param texto El texto del cual generar trigramas.
   * @returns Un Set de strings con los trigramas.
   * @private
   */
  private static trigramas(texto: string): Set<string> {
    const s = texto.toLowerCase().replace(/\s+/g, '');
    const set = new Set<string>();
    for (let i = 0; i <= s.length - 3; i++) set.add(s.slice(i, i + 3));
    return set;
  }

  /**
   * Calcula el coeficiente de similitud de Dice basado en trigramas.
   * @param a Primer texto a comparar.
   * @param b Segundo texto a comparar.
   * @returns Valor entre 0 y 1 que representa la similitud.
   * @private
   */
  private static similaridadTrigramas(a: string, b: string): number {
    const ta = SearchEngine.trigramas(a);
    const tb = SearchEngine.trigramas(b);
    if (ta.size === 0 || tb.size === 0) return 0;
    let comunes = 0;
    ta.forEach((g) => {
      if (tb.has(g)) comunes++;
    });
    return (2 * comunes) / (ta.size + tb.size);
  }

  // ─── Levenshtein ─────────────────────────────────────────────────────────

  /**
   * Calcula la distancia de Levenshtein entre dos cadenas de texto.
   * @param texto1 Primera cadena.
   * @param texto2 Segunda cadena.
   * @returns El número mínimo de operaciones para transformar una cadena en otra.
   */
  static calcularSimilitudes(texto1: string, texto2: string): number {
    const s1 = texto1.toLowerCase();
    const s2 = texto2.toLowerCase();
    const m = s1.length;
    const n = s2.length;
    if (m === 0) return n;
    if (n === 0) return m;
    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    let curr = new Array(n + 1).fill(0);
    for (let i = 1; i <= m; i++) {
      curr[0] = i;
      for (let j = 1; j <= n; j++) {
        const costo = s1[i - 1] === s2[j - 1] ? 0 : 1;
        curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + costo);
      }
      [prev, curr] = [curr, prev];
    }
    return prev[n];
  }

  // ─── Motor de scoring por capas ──────────────────────────────────────────

  /**
   * Calcula el puntaje de intención de una consulta respecto a un candidato.
   * @param query La consulta del usuario.
   * @param candidato El texto contra el cual se compara.
   * @returns Un puntaje numérico de relevancia.
   */
  scoreIntencion(query: string, candidato: string): number {
    const q = query.trim().toLowerCase();
    const c = candidato.toLowerCase();

    if (!q) return 0;

    const tokensQuery = SearchEngine.tokenizar(q);
    const tokensCandidato = SearchEngine.tokenizar(candidato);

    // ── Capa 0: prefijo de 1+ caracteres sobre cualquier token del candidato ──
    // "D" → aparece en "Dijkstra", "DFS", "DP", "Divide y Vencerás"
    // Es la primera que se evalúa para que una sola letra ya devuelva resultados.
    // El score escala con qué tan completa está la palabra (más letras = score más alto).
    const mejorPrefijo = Math.max(
      0,
      ...tokensQuery.flatMap(
        (tq) =>
          tokensCandidato
            .filter((tc) => tc.startsWith(tq))
            .map((tc) => tq.length / tc.length), // 1.0 si cubre la palabra entera
      ),
    );

    if (mejorPrefijo > 0) {
      // Con 1 letra: score mínimo ~0.50 (siempre pasa el threshold)
      // Con la palabra completa: score 1.0 (sube a la cima de la cola)
      return 0.5 + mejorPrefijo * 0.5;
    }

    // ── Capa 1: coincidencia exacta de palabra (query multi-token) ───────────
    // "algoritmo dijkstra" → ambas palabras presentes en el candidato
    const tieneExacto = tokensQuery.some((tq) =>
      tokensCandidato.some((tc) => tc === tq),
    );
    if (tieneExacto) {
      const todosPresentes = tokensQuery.every((tq) =>
        tokensCandidato.some((tc) => tc === tq),
      );
      return todosPresentes ? 1.8 : 1.5;
    }

    // ── Capa 2: n-gramas Dice (similitud fonética / ortográfica) ─────────────
    // "Dikstra" → "Dijkstra" aunque no sea prefijo exacto
    const scoreNgrama = SearchEngine.similaridadTrigramas(q, c);
    if (scoreNgrama >= 0.35) {
      return scoreNgrama * 0.75;
    }

    // ── Capa 3: Levenshtein para typos en palabras cortas ────────────────────
    const mejorLev = Math.max(
      0,
      ...tokensQuery.flatMap((tq) =>
        tokensCandidato.map((tc) => {
          const dist = SearchEngine.calcularSimilitudes(tq, tc);
          const maxLen = Math.max(tq.length, tc.length);
          return 1 - dist / maxLen;
        }),
      ),
    );
    return mejorLev * 0.45;
  }

  // ─── Threshold plano ─────────────────────────────────────────────────────
  // Un solo valor bajo para que desde la primera letra haya resultados.
  // El orden lo maneja la PriorityQueue por score, no el threshold.

  /**
   * Determina el puntaje de corte (threshold) para una consulta dada.
   * @param _query La consulta del usuario (actualmente no utilizada para variar el threshold).
   * @returns El valor numérico del puntaje de corte.
   */
  static thresholdPara(_query: string): number {
    return 0.2;
  }
}
