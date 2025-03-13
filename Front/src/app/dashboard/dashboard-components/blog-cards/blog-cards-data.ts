import * as fab from "@fortawesome/free-brands-svg-icons";
import * as far from "@fortawesome/free-regular-svg-icons";
import * as fas from "@fortawesome/free-solid-svg-icons";
export interface blogcard {
  title: string;
  subtitle: string;
  subtext: string;
  image: string;
  icon: any;
}

export const blogcards: blogcard[] = [
  {
    title: " Aprende nuevas formas de usar la programación",
    subtitle: "Resolviendo problemas de la vida real",
    subtext:
      "Utiliza los conocimientos que aprenderás aquí para solucionar diferentes problemas de la vida cotidiana y cuales son los mejores métodos para crear esta soluciones",
    image:
      "https://cdn.pixabay.com/photo/2021/02/04/17/49/rubiks-cube-5982087_640.jpg",
    icon: fas.faChalkboardTeacher,
  },
  {
    title: "Compite con diversos programadores de diferentes niveles",
    subtitle: "Cualquier universidad puede participar",
    subtext:
      "Mide y diagnostica tu nivel contra competidores de muchas diferentes universidades, promueve el espíritu de competencia y de apetito de conocimiento.",
    image: "https://www.u-aizu.ac.jp/files/images/icpc_wf04.jpg",
    icon: fas.faCode,
  },
  {
    title: "Participa en grandes eventos de programación",
    subtitle:
      "Maratones internas o competencia de reclutamiento de empresas de alto nivel",
    subtext:
      "Obtén experiencia y mide tu nivel con el resto del mundo participando en diferentes competencias de programación como la Google CodeJam o la ACM-ICPC.",
    image:
      "https://agcdn-2mrybbgckm7omi0k.netdna-ssl.com/wp-content/uploads/2019/02/alphagamma-Google-Code-Jam-2019-youth-opportunities-1021x580.jpg",
    icon: fas.faCodeBranch,
  },
  {
    title: "Aprende nuevos algoritmos y en que momento es adecuado usarlos",
    subtitle: "Para un problema, siempre habrá una solución",
    subtext:
      "Conoce un gran numero de algoritmos prediseñados, los tipos de problemas que pueden resolver y cuales son los mas rápidos al momento de usarlos.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUgNBL0QNy7RacCqPWtT8H1fY4o9hWKoGbTg&usqp=CAU",
    icon: fas.faTrophy,
  },
];
