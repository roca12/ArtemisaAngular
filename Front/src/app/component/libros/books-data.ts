import * as fab from '@fortawesome/free-brands-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';
export interface book {
    title: string,
    author: string,
    desc:string,
    year: string,
    filename:string,
    imagename:string
}


export const bookscards: book[] = [

    {
        title: 'Competitive programming handbook',
        author: 'Antti Laaksonen',
        desc: 'El propósito de este libro es darte una introducción completa a la programación competitiva. Se asume que ya dominas lo básico de programación, pero no es necesario que poseas conocimientos previos de programación competitiva. \nEl libro está especialmente destinado a estudiantes que quieran aprender algoritmos y posiblemente participar en la Olimpiada Internacional de Informática (IOI) o en el Concurso Internacional de Programación Universitaria (ICPC). Por supuesto, el libro también es adecuado para cualquier otra persona interesada en la programación competitiva.',
        year: '2020',
        filename:'(Español) Competitive Programmer’s Handbook.pdf',
        imagename:"1.jpg"
    },
    {
        title: 'Guía de programación en Java',
        author: 'Julian Stiven Muñetones',
        desc: 'Guía de nivel básico para el aprendizaje de la sintaxis básica de java, con toques de enfoque en programación competitiva',
        year: '2021',
        filename:'intro java.pdf',
        imagename:"2.jpg"
    },
    {
        title: 'Guia de programación en C++',
        author: 'Edwin Villarraga',
        desc: 'Guía de nivel básico para el aprendizaje de la sintaxis básica de C++, con toques de enfoque en programación competitiva',
        year: '2021',
        filename:'intro cpp.pdf',
        imagename:"3.jpg"
    },
    {
        title: 'Guia de programación en Python',
        author: 'Daniel Alayon',
        desc: 'Guía de nivel básico para el aprendizaje de la sintaxis básica de Python, con toques de enfoque en programación competitiva',
        year: '2021',
        filename:'intro py.pdf',
        imagename:"4.jpg"
    },
    {
        title: 'Discrete Structures (ingles)',
        author: 'Rob Hoogerwoord & Hans Zantema',
        desc: 'Documento explicativo en ingles sobre los las distintas operaciones matematicas pertenecientes a la matematica discreta, nivel intermedio - avanzado',
        year: '2016',
        filename:'Matematica discreta.pdf',
        imagename:"5.jpg"
    },
    {
        title: 'Matemática discreta',
        author: 'Francesc Comellas - Josep Fàbrega - Anna Sànchez - Oriol Serra',
        desc: 'Documento explicativo sobre los las distintas operaciones matematicas pertenecientes a la matematica discreta, nivel intermedio - avanzado',
        year: '2001',
        filename:'matemtica_discreta_para_informticos.pdf',
        imagename:"6.jpg"
    },
    {
        title: 'Principles of Algorithmic Problem Solving (ingles)',
        author: 'Johan Sannemo',
        desc: 'La resolución algorítmica de problemas es el arte de formular métodos eficientes que resolver problemas de carácter matemático. Desde los muchos algoritmos numéricos desarrollados por los antiguos babilonios hasta la fundación de la teoría de grafos por Euler, la resolución de problemas algorítmicos ha sido una búsqueda intelectual popular durante los últimos miles de años. Durante mucho tiempo, fue un esfuerzo puramente matemático con algoritmos destinados a ser ejecutados a mano. durante el reciente. La resolución algorítmica de problemas ha evolucionado durante décadas. Lo que era principalmente un tema dela investigación se convirtió en un deporte mental conocido como programación competitiva. como deporte',
        year: '2018',
        filename:'Principles of Algorithmic Problem Solving.pdf',
        imagename:"7.jpg"
    },
    

    

] 