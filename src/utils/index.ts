/**
 * Formata uma string de data ISO para formato legível em pt-BR.
 * Ex: "2024-01-15T14:30:00Z" → "15 de jan. de 2024"
 */
export function formatDate(date: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
}

/**
 * Formata data relativa (ex: "há 3 horas", "há 2 dias"). | Não utilizei essa função mas vou deixar para o caso queira implementar melhorias futuras
 */
export function formatRelativeDate(date: string): string {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now.getTime() - target.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'agora mesmo';
    if (diffMinutes < 60) return `há ${diffMinutes} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;

    return formatDate(date);
}
