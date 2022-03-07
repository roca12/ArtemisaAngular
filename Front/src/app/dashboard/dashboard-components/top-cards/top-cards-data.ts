export interface topcard {
    bgcolor: string,
    icon: string,
    title: string,
    subtitle: string
}

export const topcards: topcard[] = [

    {
        bgcolor: 'success',
        icon: 'bi bi-people-fill',
        title: '5',
        subtitle: 'Algoritmos diferentes'
    },
    {
        bgcolor: 'danger',
        icon: 'bi bi-plus-slash-minus',
        title: '5',
        subtitle: 'Niveles de dificultad'
    },
    {
        bgcolor: 'warning',
        icon: 'bi bi-file-earmark-code',
        title: '3',
        subtitle: 'Lenguajes de programación'
    },
    {
        bgcolor: 'info',
        icon: 'bi bi-send-check',
        title: '4',
        subtitle: 'Jueces calificadores online'
    },

] 