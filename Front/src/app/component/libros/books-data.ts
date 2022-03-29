import * as fab from '@fortawesome/free-brands-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';
export interface book {
    title: string,
    author: string,
    desc:string,
    year: string,
    image: string,
    filename:string
}


export const bookscards: book[] = [

    {
        title: 'Competitive programming handbook',
        author: 'Antti Laaksonen',
        desc: 'El propósito de este libro es darte una introducción completa a la programación competitiva. Se asume que ya dominas lo básico de programación, pero no es necesario que poseas conocimientos previos de programación competitiva. \nEl libro está especialmente destinado a estudiantes que quieran aprender algoritmos y posiblemente participar en la Olimpiada Internacional de Informática (IOI) o en el Concurso Internacional de Programación Universitaria (ICPC). Por supuesto, el libro también es adecuado para cualquier otra persona interesada en la programación competitiva.',
        year: '2020',
        image: 'https://cdn.pixabay.com/photo/2021/02/04/17/49/rubiks-cube-5982087_640.jpg',
        filename:'(Español) Competitive Programmer’s Handbook.pdf'
    },
    {
        title: 'Guia de programación en Java',
        author: 'Julian Stiven Muñetones',
        desc: 'Sintaxis basica de java',
        year: '2021',
        image: 'https://cdn.pixabay.com/photo/2021/02/04/17/49/rubiks-cube-5982087_640.jpg',
        filename:'intro java.pdf'
    },
    {
        title: 'Guia de programación en C++',
        author: 'Edwin Villarraga',
        desc: 'Sintaxis basica de cpp',
        year: '2021',
        image: 'https://cdn.pixabay.com/photo/2021/02/04/17/49/rubiks-cube-5982087_640.jpg',
        filename:'intro cpp.pdf'
    },
    {
        title: 'Guia de programación en Python',
        author: 'Daniel Alayon',
        desc: 'Sintaxis basica de python',
        year: '2021',
        image: 'https://cdn.pixabay.com/photo/2021/02/04/17/49/rubiks-cube-5982087_640.jpg',
        filename:'intro py.pdf'
    },
    

    

] 