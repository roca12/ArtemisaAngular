export interface topcard {
    bgcolor: string,
    icon: string,
    title: string,
    subtitle: string
}

export const topcards: topcard[] = [

    {
        bgcolor: 'success',
        icon: 'bi bi-journal-code',
        title: '300',
        subtitle: 'Algoritmos'
    },
    {
        bgcolor: 'danger',
        icon: 'bi bi-plus-slash-minus',
        title: '5',
        subtitle: 'Niveles'
    },
    {
        bgcolor: 'warning',
        icon: 'bi bi-file-earmark-code',
        title: '3',
        subtitle: 'Lenguajes'
    },
    {
        bgcolor: 'info',
        icon: 'bi bi-send-check',
        title: '4',
        subtitle: 'Jueces'
    },

] 